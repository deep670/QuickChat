import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

    const { getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext)

    const [input, setInput] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const menuRef = useRef(null)
    const navigate = useNavigate();

    const filteredUsers = input
        ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
        : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    // Close menu when tapping outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    return (
        <div className={`bg-[#8185B2]/10 h-full flex flex-col rounded-r-xl text-white
            ${selectedUser ? "hidden md:flex" : "flex"}`}>

            {/* ------- HEADER ------- */}
            <div className='px-4 sm:px-5 pt-4 sm:pt-5 pb-3 shrink-0'>
                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="logo" className='w-24 sm:w-32 max-w-[160px]' />
                    {/* 3-dot menu — tap toggle for mobile */}
                    <div className="relative" ref={menuRef}>
                        <img
                            src={assets.menu_icon}
                            alt="Menu"
                            className='h-4 sm:h-5 cursor-pointer p-1'
                            onClick={() => setMenuOpen(prev => !prev)}
                        />
                        {menuOpen && (
                            <div className='absolute top-full right-0 z-20 w-36 py-2 px-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-lg'>
                                <p
                                    onClick={() => { navigate('/profile'); setMenuOpen(false) }}
                                    className='cursor-pointer text-xs sm:text-sm py-2 hover:text-violet-400 transition-colors'
                                >
                                    Edit Profile
                                </p>
                                <hr className="border-t border-gray-600" />
                                <p
                                    onClick={() => { logout(); setMenuOpen(false) }}
                                    className='cursor-pointer text-xs sm:text-sm py-2 hover:text-violet-400 transition-colors'
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ------- SEARCH ------- */}
                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 mt-4'>
                    <img src={assets.search_icon} alt="Search" className='w-3 shrink-0' />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1 min-w-0'
                        placeholder='Search User...'
                    />
                </div>
            </div>

            {/* ------- USER LIST ------- */}
            <div className='flex-1 overflow-y-auto px-2 sm:px-3 pb-4'>
                {filteredUsers.map((user, index) => (
                    <div
                        onClick={() => {
                            setSelectedUser(user);
                            setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                        }}
                        key={index}
                        className={`relative flex items-center gap-2 sm:gap-3 p-2 sm:p-2 pl-3 sm:pl-4 rounded-lg cursor-pointer transition-colors
                            ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : 'hover:bg-[#282142]/30'}`}
                    >
                        <div className='relative shrink-0'>
                            <img
                                src={user?.profilePic || assets.avatar_icon}
                                alt=""
                                className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover aspect-square'
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-[#1a1a2e]'></span>
                            )}
                        </div>

                        <div className='flex flex-col leading-5 min-w-0 flex-1'>
                            <p className='text-sm sm:text-base truncate'>{user.fullName}</p>
                            {onlineUsers.includes(user._id)
                                ? <span className='text-green-400 text-xs'>Online</span>
                                : <span className='text-neutral-400 text-xs'>Offline</span>
                            }
                        </div>

                        {unseenMessages[user._id] > 0 && (
                            <span className='shrink-0 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                                {unseenMessages[user._id]}
                            </span>
                        )}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Sidebar
