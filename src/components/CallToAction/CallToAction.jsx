import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

export default function CallToAction() {
    return (
        <div className='flex flex-col items-center text-center gap-4 pt-10 pb-24 px-8 md:px-0 md:pt-20'>
            <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>How It Works</h1>
            <p className='text-gray-500 sm:text-sm max-w-2xl mx-auto' > The National Restaurant Association strongly encourages its members to donate more food, and we recently partnered with Food Donation Connection (FDC) to do just that. Founded by a former restaurant executive, FDC serves as the liaison between the restaurants interested.</p>
            <div className="flex items-center font-medium gap-6 mt-4">
                <button className='px-10 py-3 rounded-md text-white bg-green-600' >Get Started</button>
                <button className='flex items-center gap-2' >Learn More <FaArrowRight /></button>
            </div>
        </div>
    )
}
