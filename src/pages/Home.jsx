'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
const Home = () => {

  const router = useRouter()
  return ( 
    <div className='flex items-center justify-center h-screen'>
    <div className='flex flex-col items-center justify-center gap-2'>
      {/* login button */}
        <button className='absolute top-5 right-15' onClick={() => router.push("/login")}>Login</button>
        {/* headings */}
        <div className='flex flex-col items-start'>
          <h1 className='text-3xl font-medium '>Welcome to <span className='text-orange-600'>Right-Thing</span></h1>
        <p className='text-gray-400'>You reached to the <span>Right thing</span> at <span>Right time</span></p>
        </div>
        {/* main button */}
        <button className='border-blue-400 border-2 text-blue-400 px-4 py-2 mt-5 rounded cursor-pointer' onClick={() => router.push("/dashboard")}>Open Dashboard</button>
    </div>
    </div>
  )
}

export default Home 