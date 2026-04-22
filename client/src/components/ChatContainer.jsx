import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = ({ onOpenProfile, onCloseProfile, showProfile }) => {

    const { messages, selectedUser, setSelectedUser, sendMessage,
        getMessages } = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()
    const [input, setInput] = useState('');

    // SEND MESSAGE
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("")
    }

    // SEND AN IMAGE
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image file")
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result })
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (selectedUser) getMessages(selectedUser._id)
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages)
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return selectedUser ? (
        <div className='h-full flex flex-col relative backdrop-blur-lg overflow-hidden'>

            {/* ------- HEADER ------- */}
            <div className='flex items-center gap-3 py-3 px-4 border-b border-stone-500 shrink-0'>
                {/* Back arrow — mobile only */}
                <img
                    onClick={() => setSelectedUser(null)}
                    src={assets.arrow_icon}
                    alt="Back"
                    className='md:hidden w-5 cursor-pointer shrink-0'
                />

                {/* Tappable user info — opens RightSidebar drawer on mobile */}
                <div
                    className='flex items-center gap-2 flex-1 cursor-pointer min-w-0'
                    onClick={onOpenProfile}
                >
                    <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <p className='text-sm sm:text-base text-white flex items-center gap-2 truncate'>
                        {selectedUser.fullName}
                        {onlineUsers.includes(selectedUser._id) && (
                            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                        )}
                    </p>
                </div>

                {/* Help icon — toggles sidebar on desktop too */}
                <img
                    src={assets.help_icon}
                    alt="Info"
                    className='w-5 shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity'
                    onClick={onOpenProfile}
                />
            </div>

            {/* ------- CHAT AREA ------- */}
            <div className='flex-1 overflow-y-auto p-3 pb-4 space-y-1'>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-end gap-2 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
                    >
                        {/* Avatar left — received messages */}
                        {msg.senderId !== authUser._id && (
                            <div className="text-center shrink-0">
                                <img
                                    src={selectedUser?.profilePic || assets.avatar_icon}
                                    alt=""
                                    className='w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover'
                                />
                                <p className='text-gray-500 text-[10px] sm:text-xs mt-0.5'>
                                    {formatMessageTime(msg.createdAt)}
                                </p>
                            </div>
                        )}

                        {/* Bubble / image */}
                        {msg.image ? (
                            <img
                                src={msg.image}
                                alt=""
                                className='max-w-[180px] sm:max-w-[230px] border border-gray-700 rounded-lg mb-6'
                            />
                        ) : (
                            <p className={`p-2 max-w-[70vw] sm:max-w-[200px] text-xs sm:text-sm font-light rounded-lg mb-6 break-words bg-violet-500/30 text-white
                                ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                {msg.text}
                            </p>
                        )}

                        {/* Avatar right — sent messages */}
                        {msg.senderId === authUser._id && (
                            <div className="text-center shrink-0">
                                <img
                                    src={authUser?.profilePic || assets.avatar_icon}
                                    alt=""
                                    className='w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover'
                                />
                                <p className='text-gray-500 text-[10px] sm:text-xs mt-0.5'>
                                    {formatMessageTime(msg.createdAt)}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>

            {/* ------- BOTTOM INPUT ------- */}
            <div className='shrink-0 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-t border-stone-500/40'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                        type="text"
                        placeholder="Send a message"
                        className='flex-1 text-xs sm:text-sm p-2.5 sm:p-3 border-none bg-transparent rounded-lg outline-none text-white placeholder-gray-400'
                    />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} alt="" className="w-4 sm:w-5 mr-2 cursor-pointer" />
                    </label>
                </div>
                <img
                    onClick={handleSendMessage}
                    src={assets.send_button}
                    alt=""
                    className="w-6 sm:w-7 cursor-pointer shrink-0"
                />
            </div>

        </div>
    ) : (
        <div className='hidden md:flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10'>
            <img src={assets.logo_icon} className='max-w-16' alt="" />
            <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
        </div>
    )
}

export default ChatContainer
