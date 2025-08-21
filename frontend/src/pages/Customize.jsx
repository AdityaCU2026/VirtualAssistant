import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.png'
import image3 from '../assets/image3.png'
import image4 from '../assets/image4.jpeg'
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

function Customize(){
  const {serverUrl,userData, setUserData,backendImage, setBackendImage,frontendImage, setFrontendImage,
        selectedImage, setSelectedImage} = useContext(userDataContext);
  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e)=>{
   const file = e.target.files[0];
   setBackendImage(file);
   setFrontendImage(URL.createObjectURL(file));
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353]
    flex justify-center items-center flex-col p-[20px] '>

      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]'
        onClick = {()=>navigate("/")}/>

      <h1 className='text-white text-[30px] mb-[30px] text-center'>
        Select your <span className='text-blue-200'>Assistant Image</span>
      </h1>

      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
        <Card image={image1}/>
        <Card image={image4}/>
        <Card image={image3}/>
        <Card image={image2}/>

        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl
          overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
          hover:border-4 hover:border-white flex justify-center items-center
          ${selectedImage=="input" ? "border-4 border-white shadow-2xl shadowblue-950":null}`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input");
          }}
        >
          {!frontendImage && <LuImagePlus className='text-white w-[25px] h-[25px]'/>}
          {frontendImage && <img src={frontendImage} className='h-full object-cover' />}
        </div>

         <input type="file" accept="image/*" ref={inputImage} hidden
         onChange={handleImage}/>
      </div>

      {selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] bg-white  cursor-pointer rounded-full text-black font-semibold text-[19px]
      ' onClick = {()=>navigate("/customize2")}>
        Next
      </button>}
    </div>
  )
}

export default Customize
