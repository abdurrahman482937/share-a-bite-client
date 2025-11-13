import React from 'react'
import { FaFacebook, FaGoogle, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-10 text-left w-full mt-10 '>
      <div className="flex flex-col md:flex-row items-c px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full " >
          <div className="flex items-center gap-2 text-white font-semibold text-2xl">
            <p>Share A Bite</p>
          </div>
          <p className='mt-6 text-center md:text-left text-sm text-white/80 '>Food Donation Connection administers these programs through the use of an efficient communication and reporting network. Ongoing monitoring and follow-up to ensure program implementation and growth.
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full md:ml-10">
          <h2 className='font-semibold text-white mb-5'>company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className=" md:flex flex-col lg:items-start items-center w-full">
          <h2 className='font-semibold text-white mb-5'>subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>The latest news, articles, and
            resources, sent to your inbox weekly. </p>
          <div className="flex items-center gap-2 pt-4 " >
            <input className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm' type="email" placeholder='Enter your email' />
            <button className='bg-green-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <FaGoogle className='text-white mt-4 cursor-pointer' size={30} />
            <FaFacebook className='text-white mt-4 cursor-pointer' size={30} />
            <FaTwitter className='text-white mt-4 cursor-pointer' size={30} />
            <FaLinkedin className='text-white mt-4 cursor-pointer' size={30} />
            <FaYoutube className='text-white mt-4 cursor-pointer' size={30} />
          </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 @ abdurrahman. All Right Reserved.</p>
    </footer >
  )
}



export default Footer