import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-2xl backdrop-blur-2xl text-gray-300 border border-gray-600 rounded-xl overflow-hidden
          flex flex-col sm:flex-row sm:items-center sm:justify-between'>

        {/* ------- PROFILE IMAGE ------- */}
        <div className='flex justify-center items-center pt-8 sm:pt-0 sm:px-8 sm:order-2 shrink-0'>
          <img
            className='w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full object-cover border-2 border-gray-600'
            src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon}
            alt="Profile"
          />
        </div>

        {/* ------- FORM ------- */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:gap-5 p-6 sm:p-8 lg:p-10 flex-1 sm:order-1'>
          <h3 className='text-base sm:text-lg font-medium text-white'>Profile details</h3>

          {/* Upload */}
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer group w-fit'>
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type='file'
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-500 shrink-0'>
              <img
                src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
                alt=''
                className='w-full h-full object-cover'
              />
            </div>
            <span className='text-sm text-gray-400 group-hover:text-violet-400 transition-colors'>
              Upload profile image
            </span>
          </label>

          {/* Name */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type='text'
            required
            placeholder='Your name'
            className='p-2.5 bg-transparent text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-500'
          />

          {/* Bio */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
            className='p-2.5 bg-transparent text-sm border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-500 resize-none'
            rows={4}
          />

          {/* Submit */}
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white py-2.5 px-6 rounded-full text-sm sm:text-base font-medium cursor-pointer hover:opacity-90 transition-opacity'
          >
            Save
          </button>
        </form>

      </div>
    </div>
  )
}

export default ProfilePage
