'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
const Home = () => {

  const router = useRouter()
  return ( 
    <div>
        <button onClick={() => router.push("/login")}>Login</button>
        <h1 className='text-2xl font-bold'>Welcome to <span className='text-orange-700'>Right-Thing</span></h1>
        <p>You reached to the <span>Right thing</span> at <span>Right time</span></p>
        <button className='border-orange-700 border-2 text-orange-700 px-4 py-2 rounded'>Open Dashboard</button>
    </div>
  )
}

export default Home 