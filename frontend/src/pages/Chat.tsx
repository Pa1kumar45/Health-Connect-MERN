import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext';
import { axiosInstance } from '../utils/axios';
import MessageInput from '../components/MessageInput';
import { useMessage } from '../context/MessageContext';
import { formatMessageTime } from '../lib/utils';

const Chat = () => {
    const { id } = useParams();
    const { currentUser, socket } = useApp();
    const { fetchMessages, messages, getSelectedUser, selectedUser, setMessages } = useMessage();
    
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    
    useEffect(() => {
      listenToNewMessages();
      return () => {
        stopListeningToMessages();
      }
    }, [])
    
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
            console.log("Message sent:", response.data.newMessage);
            setMessages([...messages, response.data.newMessage]);
            
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    const listenToNewMessages = () => {
        socket?.on("newMessage", (newMessage) => {
           console.log("messge socket", newMessage);
           if(newMessage.receiverId == currentUser?._id) {
               setMessages([...messages, newMessage])
           }
        })
    }
    
    const stopListeningToMessages = () => {
        socket?.off('newMessage');
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-100">
            {/* Main chat container with fixed height and overflow control */}
            <div className="flex flex-col h-full">
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-2 py-2 md:px-4 md:py-3"
                >
                    {messages?.length > 0 ? (
                        <div className="space-y-3 pb-1">
                            {messages.map((message, index) => {
                                const isCurrentUser = message.senderId === currentUser?._id;
                                const isLastMessage = index === messages.length - 1;
                                
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                        ref={isLastMessage ? messageEndRef : null}
                                    >
                                        {!isCurrentUser && (
                                            <div className="flex-shrink-0 mr-2">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-700 overflow-hidden">
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
                                            <div className="flex-shrink-0 ml-2">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-700 overflow-hidden">
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
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>No messages yet. Start a conversation!</p>
                        </div>
                    )}
                </div>

                {/* Message input fixed at bottom */}
                <div className="mt-auto border-t border-gray-800">
                    <MessageInput sendMessage={sendMessage} />
                </div>
            </div>
        </div>
    )
}

export default Chat;