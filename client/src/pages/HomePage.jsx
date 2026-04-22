import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className='w-full h-screen sm:px-[10%] md:px-[5%] lg:px-[10%] xl:px-[15%] sm:py-[5%]'>
      <div
        className={`backdrop-blur-xl border border-gray-600 sm:rounded-2xl overflow-hidden h-full grid
          ${selectedUser
            ? 'grid-cols-1 md:grid-cols-[1fr_1.5fr]'
            : 'grid-cols-1 md:grid-cols-[1fr_1.5fr]'
          }`}
      >
        <Sidebar />
        <ChatContainer
          onOpenProfile={() => setShowProfile(true)}
          showProfile={showProfile}
        />
      </div>

      <RightSidebar
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  )
}

export default HomePage
