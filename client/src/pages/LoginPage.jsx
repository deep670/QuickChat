import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex flex-col sm:flex-row items-center justify-center sm:justify-evenly gap-6 sm:gap-8 px-4 py-10 backdrop-blur-2xl'>

      {/* -------- LOGO -------- */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className='w-[min(40vw,200px)] sm:w-[min(30vw,250px)]'
      />

      {/* -------- FORM -------- */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-sm border border-gray-500 bg-white/8 text-white p-6 sm:p-8 flex flex-col gap-5 rounded-xl shadow-lg'
      >
        <h2 className='font-medium text-xl sm:text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back"
              className='w-5 cursor-pointer'
            />
          )}
        </h2>

        {/* Full Name */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className='p-2.5 text-sm bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400'
            placeholder="Full Name"
            required
          />
        )}

        {/* Email & Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              required
              className='p-2.5 text-sm bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              required
              className='p-2.5 text-sm bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400'
            />
          </>
        )}

        {/* Bio */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2.5 text-sm bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 resize-none'
            placeholder='Provide a short bio...'
            required
          />
        )}

        {/* Submit Button */}
        <button
          type='submit'
          className='py-2.5 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm sm:text-base font-medium rounded-md cursor-pointer hover:opacity-90 transition-opacity'
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Terms */}
        <div className='flex items-start gap-2 text-xs sm:text-sm text-gray-400'>
          <input type="checkbox" className='mt-0.5 accent-violet-500 shrink-0' />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {/* Toggle Sign up / Login */}
        <div>
          {currState === "Sign up" ? (
            <p className='text-xs sm:text-sm text-gray-400'>
              Already have an account?{' '}
              <span
                onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}
                className='font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-xs sm:text-sm text-gray-400'>
              Don't have an account?{' '}
              <span
                onClick={() => setCurrState("Sign up")}
                className='font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'
              >
                Sign up here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage
