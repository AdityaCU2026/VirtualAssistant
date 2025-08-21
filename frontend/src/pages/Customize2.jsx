import React, { useState } from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";

const Customize2 = () => {
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async () => {
        setLoading(true);
        try {
        let formData = new FormData();
        formData.append("assistantName", assistantName);
        if (backendImage) {
            formData.append("assistantImage", backendImage);
        }
        else{
            formData.append("imageUrl", selectedImage);
        }
          const result = await axios.post(`${serverUrl}/api/user/update`,formData, {
            withCredentials: true,
          });
          setLoading(false);
          console.log(result.data);
          setUserData(result.data);
          navigate("/"); // Redirect to home page after updating assistant
        } catch (error) {
          setLoading(false);
            console.error("Error updating assistant:", error);
        }
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353]
    flex justify-center items-center flex-col p-[20px] relative'>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]'
        onClick = {()=>navigate("/customize")}/>
       <h1 className='text-white mb-[40px] text-[30px] text-center'>
         Enter your
          <span className='text-blue-200'>
             Assistant Name
        </span>
        </h1>
        <input type="text" placeholder='eg. shifra' className='w-full max-w-[600px] h-[60px]
        outline-none border-2 border-white bg-transparent text-white placeholder-gray-300
        px-[20px] py-[10px] rounded-full text-[18px]'required
        onChange = {(e)=>setAssistantName(e.target.value)} value = {assistantName}/>
        {assistantName.length>0 && <button className='min-w-[300px] h-[60px] mt-[30px] bg-white  cursor-pointer rounded-full text-black font-semibold text-[19px]
      ' disabled = {loading} onClick = {()=>{
        // navigate("/customize2");
        handleUpdateAssistant();
        }}>
        {!loading ? "Finally create your Assistant" : "Loading..."}
      </button>}

    </div>
  )
}

export default Customize2