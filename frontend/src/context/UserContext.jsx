import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

const UserContext = ({ children }) => {
    const serverUrl = "https://virtualassistant-backend-a0n2.onrender.com";
    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true
            });
            setUserData(result.data);
            console.log("User data fetched successfully:", result.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // FIX 1: Wrap getGeminiResponse in useCallback
    // This prevents the function from being recreated on every render,
    // stabilizing the useEffect hook in the Home component.
    const getGeminiResponse = useCallback(async (command) => {
         console.log("🚀 API CALL INITIATED with command:", command);
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,
                { command }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error(`UserContext error:getGeminiResponse: ${error}`);

            // FIX 3: Return a structured error object on failure.
            // This prevents crashes and allows the UI to display a helpful message.
            if (error.response) {
                return error.response.data; // Server responded with an error (e.g., 4xx, 5xx)
            }
            return { message: "A network error occurred. Please try again." }; // Network or other error
        }
    }, [serverUrl]); // Dependency: serverUrl (though it doesn't change, it's good practice)

    useEffect(() => {
        handleCurrentUser();
    }, []);

    // FIX 2: Memoize the context value with useMemo.
    // This prevents unnecessary re-renders in components that consume this context.
    const value = useMemo(() => ({
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }), [userData, backendImage, frontendImage, selectedImage, getGeminiResponse]);


    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
};

export default UserContext;
