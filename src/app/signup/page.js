'use client'
import React from 'react'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

const page = () => {

    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if(error) {
            console.log(error)
        }
        else {
            console.log(data)
            setTimeout(() => {
                router.push("/login")
            }, 1000);
        }
    }
  return (
    <div>
        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignup}>Sign Up</button>
    </div>
  )
}

export default page