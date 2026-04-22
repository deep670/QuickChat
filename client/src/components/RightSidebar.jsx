import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = ({ isOpen, onClose }) => {

    const { selectedUser, messages } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    useEffect(() => {
        setMsgImages(
            messages.filter(msg => msg.image).map(msg => msg.image)
        )
    }, [messages])

    if (!selectedUser) return null;

    return (
        <>
            <div className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}/>
            onClick={onClose}
            <div className={`fixed top-0 right-0 z-40 h-full w-[75vw] max-w-xs sm:w-80 flex flex-col text-white 
             bg-[#1e1a35] border-l border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
                {/* CLOSE BUTTON */}
                <div className='flex justify-end p-4 pb-0'>
                    <button onClick={onClose} className='text-gray-400 hover:text-white text-xl leading-none'>
                        ✕
                    </button>
                </div>

                {/* USER INFO */}
                <div className='pt-6 flex flex-col items-center gap-2 text-xs font-light px-4'>
                    <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
                    className='w-20 h-20 rounded-full object-cover'/>
                    
                    <h1 className='text-lg font-medium flex items-center gap-2 text-center'>
                        {onlineUsers.includes(selectedUser._id) && (
                            <span className='w-2 h-2 rounded-full bg-green-500 shrink-0'></span>
                        )}
                        {selectedUser.fullName}
                    </h1>
                    <p className='text-center text-gray-400 px-4 text-xs'>{selectedUser.bio}</p>
                </div>

                <hr className="border-[#ffffff30] my-4 mx-4" />

                {/* MEDIA */}
                <div className="px-4 text-xs flex-1 overflow-y-auto">
                    <p className='text-gray-400 mb-2'>Media</p>
                    {msgImages.length === 0 ? (
                        <p className='text-gray-600 text-xs'>No media shared yet.</p>
                    ) : (
                        <div className='grid grid-cols-2 gap-2 opacity-80'>
                            {msgImages.map((url, index) => (
                                <div key={index}
                                onClick={() => window.open(url)}
                                className='cursor-pointer rounded overflow-hidden aspect-square'>
                                    <img src={url} alt="" className='w-full h-full object-cover rounded-md' />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* LOGOUT */}
                <div className='p-5 flex justify-center shrink-0'>
                        <button
                        onClick={() => logout()}
                        className='w-full max-w-[200px] bg-gradient-to-r from-purple-400 to-violet-600 text-white 
                        text-sm font-light py-2 px-6 rounded-full cursor-pointer hover:opacity-90 transition-opacity'>
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default RightSidebar
