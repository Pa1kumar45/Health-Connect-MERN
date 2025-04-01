import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext';
import { axiosInstance } from '../utils/axios';
import MessageInput from '../components/MessageInput';
import { useMessage } from '../context/MessageContext';
import { formatMessageTime } from '../lib/utils';

const Chat = () => {
    const { id } = useParams();
    const { currentUser } = useApp();
    const { fetchMessages, messages, getSelectedUser, selectedUser } = useMessage();
    
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    
    // Fixed useEffect to prevent infinite loop by not including function dependencies
    useEffect(() => {
        if (id) {
            fetchMessages(id);
            getSelectedUser(id);
        }
    }, [id]); // Only depend on id
    
    useEffect(() => {
        if (messageEndRef.current && messages?.length > 0) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (data) => {
        try {
            const response = await axiosInstance.post(`/message/send/${id}`, data);
            console.log("Message sent:", response);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    
    return (
        <div className="flex-1 flex flex-col h-full bg-gray-900 text-gray-100">
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages?.map((message, index) => {
                    const isCurrentUser = message.senderId === currentUser?._id;
                    const isLastMessage = index === messages.length - 1;
                    
                    return (
                        <div
                            key={message._id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
                            ref={isLastMessage ? messageEndRef : null}
                        >
                            {!isCurrentUser && (
                                <div className="avatar mr-2">
                                    <div className="w-10 h-10 rounded-full border border-gray-700">
                                        <img
                                            src={selectedUser?.avatar || "/image.png"}
                                            alt="profile pic"
                                            className="object-cover w-full h-full rounded-full" 
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className={`max-w-xs md:max-w-md`}>
                                <div className="text-xs mb-1 flex items-center">
                                    <span className="font-medium mr-2">
                                        {isCurrentUser ? "You" : selectedUser?.name || "User"}
                                    </span>
                                    <time className="text-xs text-gray-400">
                                        {formatMessageTime(message.createdAt)}
                                    </time>
                                </div>
                                
                                <div className={`rounded-lg p-3 ${
                                    isCurrentUser 
                                        ? "bg-blue-600 text-white rounded-tr-none" 
                                        : "bg-gray-700 text-white rounded-tl-none"
                                }`}>
                                    {message.image && (
                                        <div className="mb-2">
                                            <img
                                                src={message.image}
                                                alt="Attachment"
                                                className="rounded-md max-w-full"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    {message.text && <p className="break-words">{message.text}</p>}
                                </div>
                            </div>
                            
                            {isCurrentUser && (
                                <div className="avatar ml-2">
                                    <div className="w-10 h-10 rounded-full border border-gray-700">
                                        <img
                                            src={currentUser?.avatar || "/image.png"}
                                            alt="profile pic"
                                            className="object-cover w-full h-full rounded-full" 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {(!messages || messages.length === 0) && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                )}
            </div>

            <MessageInput sendMessage={sendMessage} />
        </div>
    )
}

export default Chat;