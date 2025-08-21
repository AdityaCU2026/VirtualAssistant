import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from '../assets/ai.gif'; // Assuming you have an AI image in your assets
import userImg from '../assets/user.gif'; // Assuming you have a user image in your assets
const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isWaitingForApiRef = useRef(false); // FIX: Add flag to track API call state
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Click Start to begin.");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      navigate("/signup");
    } catch (error) {
      setUserData(null);
      navigate("/signup");
      console.log(error);
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    } else if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    } else if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    } else if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    } else if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    } else if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    speak(response);
  };

  const speak = (text) => {
    console.log("✅ 4. Attempting to speak the response...");
    const synth = window.speechSynthesis;

    synth.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (voices.length === 0) {
      console.error("❌ ERROR: No speech synthesis voices available.");
      setStatusMessage("Error: No voices available to speak.");
      if (recognitionRef.current && isListening) {
        recognitionRef.current.start();
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice =
      voices.find(voice => voice.lang.startsWith('hi-IN')) || voices.find(voice => voice.lang.startsWith('en-US'))
      voices.find(voice => voice.lang.startsWith('en')) ||
      voices[0];

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      console.log("✅ 5. Speech has started!");
      setStatusMessage("Speaking...");
    };

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      console.log("✅ 6. Speech has ended. Restarting recognition...");
      setStatusMessage("Listening...");
      if (recognitionRef.current && isListening) {
        setTimeout(() => recognitionRef.current.start(), 100);
      }
    };

    synth.speak(utterance);
  };

  const loadVoices = () => {
    
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      console.log("Speech synthesis voices loaded.");
    }
  };

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    setStatusMessage("Initializing...");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage("Error: Speech Recognition not supported.");
      setIsListening(false);
      return;
    }

    let fatalError = false;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("🎤 Microphone is on. Start speaking.");
      setStatusMessage("Listening...");
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      console.log(`✅ 1. Heard: "${transcript}"`);

      if (userData?.assistantName && transcript.includes(userData.assistantName.toLowerCase())) {
        console.log(`✅ 2. Wake word "${userData.assistantName}" detected.`);
        setStatusMessage("Processing...");
        setAiText("");
        setUserText(transcript); // Store user input for display

        const wakeWord = userData.assistantName.toLowerCase();
        const command = transcript.replace(new RegExp(`\\b${wakeWord}\\b`, 'g'), '').trim();

        if (!command) {
          speak("Yes? How can I help?");
          return;
        }

        try {
          isWaitingForApiRef.current = true; // FIX: Set flag before API call
          const data = await getGeminiResponse(command);
          isWaitingForApiRef.current = false; // FIX: Clear flag after API call completes

          console.log("✅ 3. Received response from API:", data);

          if (data?.response) {
            handleCommand(data);
            setAiText(data.response); // Store AI response for display
            setUserText("");
          } else {
            const errorMessage = data?.message || "I'm sorry, I encountered an issue.";
            console.error(`❌ ERROR: API issue: ${errorMessage}`);
            speak(errorMessage);
          }
        } catch (error) {
          isWaitingForApiRef.current = false; // FIX: Clear flag on error too
          console.error("❌ ERROR: Failed to fetch response from API.", error);
          speak("I'm having trouble connecting to my services right now.");
        }
      }
    };

    recognition.onend = () => {
      // setUserText("");
      // FIX: Add check for the new API flag to prevent race condition
      if (isListening && !fatalError && !isSpeakingRef.current && !isWaitingForApiRef.current) {
        console.log("🎤 Recognition ended unexpectedly. Restarting...");
        recognition.start();
      } else {
        console.log("🛑 Recognition stopped intentionally (speaking or awaiting API).");
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        return;
      } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setStatusMessage("Error: Microphone access denied.");
        fatalError = true;
        setIsListening(false);
      } else {
        setStatusMessage(`Error: ${event.error}`);
      }
    };

    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      }
    };
  }, [isListening, userData?.assistantName, getGeminiResponse]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d]
    flex justify-center items-center flex-col gap-[15px] p-5'>
      <div className='absolute top-[20px] right-[20px] flex gap-4'>
          {isListening && (
            <>
              <button className='min-w-[150px] h-[60px] text-white font-semibold bg-red-600 rounded-full text-[19px] px-5 py-3 cursor-pointer
                hover:bg-red-700'
                onClick={() => setIsListening(false)}>Stop Assistant</button>
              <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] px-5 py-3 cursor-pointer'
                onClick={() => navigate("/customize")}>Customize</button>
              <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer'
                onClick={handleLogout}>Log Out</button>
            </>
          )}
      </div>

      {!isListening ? (
        <div className='text-center'>
          <h1 className='text-white text-4xl font-bold mb-4'>Welcome, {userData?.name || 'Guest'}!</h1>
          <p className='text-gray-300 mb-8'>{statusMessage}</p>
          <button
            className='min-w-[200px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer
            hover:bg-gray-200 transition-colors'
            onClick={() => setIsListening(true)}
          >
            Start Assistant
          </button>
        </div>
      ) : (
        <>
          <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-lg shadow-lg'>
            <img src={userData?.assistantImage} alt="Assistant" className='h-full w-full object-cover' />
          </div>
          <h1 className='text-white text-xl font-semibold mt-4'>I'm {userData?.assistantName || 'your assistant'}</h1>
          <p className='text-gray-400 font-mono'>{statusMessage}</p>
        </>
      )}

      {!aiText && <img src={userImg} className='w-[200px]'/>}
      {aiText && <img src={aiImg} className='w-[200px]'/>}

      <h1 className='text-white'>{userText ? userText : aiText ? aiText : null}</h1>
    </div>
  );
};

export default Home;