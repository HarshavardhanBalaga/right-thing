'use client'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'  // ✅ correct import

export default function SignupPage() { // ✅ Uppercase component name
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSignup = async () => {
        if (!email || !password) {
            setErrorMessage("Email and password are required.")
            return
        }

        setLoading(true)
        const { data, error } = await supabase.auth.signUp({ email, password })

        setLoading(false)

        if (error) {
            setErrorMessage(error.message)
        } else {
            console.log(data)
            setTimeout(() => {
                router.push("/login")
            }, 1000)
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup} disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    )
}
