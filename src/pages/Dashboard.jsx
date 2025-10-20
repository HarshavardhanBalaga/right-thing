'use client'
import React from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
const Dashboard = () => {

  const router = useRouter()
  const handleLogout = () => {
    const { data, error } = supabase.auth.signOut()
    if (error) {
      console.log(error)
    } else {
      console.log(data)
      router.push("/")
    }
  }
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard