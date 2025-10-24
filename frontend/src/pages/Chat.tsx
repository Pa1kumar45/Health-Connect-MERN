import  { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext';
import { axiosInstance } from '../utils/axios';
import MessageInput from '../components/MessageInput';
import { useMessage } from '../context/MessageContext';
import { formatMessageTime } from '../lib/utils';
import { Video } from 'lucide-react';
import { useVideoCall } from '../context/VideoCallContext';
import VideoCall from '../components/VideoCall';
import { Message } from '../types/index.ts';

// interface User {
//     _id: string;
//     name: string;
//     email: string;
//     avatar?: string;
//     role: string;
//     profileCompleted: boolean;
//     contactNumber?: string;
//     dateOfBirth?: string;
//     gender?: string;
//     bloodGroup?: string;
//     allergies?: string;
//     emergencyContact?: Array<{
//         name: string;
//         relationship: string;
//         contactNumber: string;
//     }>;
// }



const Chat = () => {
    const { id } = useParams<{ id: string }>();
    const { currentUser, socket } = useApp();
    const messageContext = useMessage();
    const { startCall } = useVideoCall();
    
    if (!messageContext) {
        return <div>Loading...</div>;
    }
    
    const { fetchMessages, messages, getSelectedUser, selectedUser, setMessages } = messageContext;
    
    const messageEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (id) {
            fetchMessages_data(id);
        }
    }, [id]);

    const fetchMessages_data = async (id: string) => {
        try {
            await fetchMessages(id);
            await getSelectedUser(id);
        } catch (error) {
            console.error("Error fetching chat data:", error);
        }
    }
    
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: Message) => {
            // Add message if current user is either the sender or receiver
            // and the message is part of the current conversation
            // Convert to strings to ensure proper comparison
            const messageSenderId = String(newMessage.senderId);
            const messageReceiverId = String(newMessage.receiverId);
            const currentUserId = String(currentUser?._id);
            const chatPartnerId = String(id);
            
            const isPartOfCurrentConversation = 
                (messageSenderId === chatPartnerId && messageReceiverId === currentUserId) ||
                (messageSenderId === currentUserId && messageReceiverId === chatPartnerId);
            
            if (isPartOfCurrentConversation) {
                setMessages((prevMessages:Message[]) => {
                    if (!prevMessages) return [newMessage];
                    // Avoid duplicate messages
                    const messageExists = prevMessages.some(msg => String(msg._id) === String(newMessage._id));
                    if (messageExists) return prevMessages;
                    return [...prevMessages, newMessage];
                });
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, currentUser?._id, setMessages, id]);

    useEffect(() => {
        if (messageEndRef.current && messages && messages.length > 0) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (data: { text?: string; image?: string }) => {
        try {
            // If there's an image, use multipart/form-data, otherwise use JSON
            const config = data.image ? {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            } : {
                headers: {
                    "Content-Type": "application/json",
                }
            };
            
            const response = await axiosInstance.post(`/message/send/${id}`, data, config);
            
            // Add message immediately for better UX
            // The socket will also emit it, but we have duplicate check in socket handler
            setMessages((prevMessages:Message[]) => {
                if (!prevMessages) return [response.data.newMessage];
                // Check if message already exists (might have been added by socket)
                const messageExists = prevMessages.some(msg => String(msg._id) === String(response.data.newMessage._id));
                if (messageExists) return prevMessages;
                return [...prevMessages, response.data.newMessage];
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    const handleVideoCall = () => {
        if (id) {
            startCall(id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-100">
            <div className="flex flex-col h-full">
                <div className="flex justify-end p-2">
                    <button
                        onClick={handleVideoCall}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        <Video size={20} />
                    </button>
                </div>

                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-2 py-2 md:px-4 md:py-3"
                >
                    {messages?.length > 0 ? (
                        <div className="space-y-3 pb-1">
                            {messages.map((message: Message, index: number) => {
                                // Convert to strings for proper comparison
                                const isCurrentUser = String(message.senderId) === String(currentUser?._id);
                                const isLastMessage = index === messages.length - 1;
                                
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} items-start gap-3`}
                                        ref={isLastMessage ? messageEndRef : null}
                                    >
                                        {!isCurrentUser && (
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-100 dark:border-blue-900 overflow-hidden">
                                                    {selectedUser?.avatar ? (
                                                        <img
                                                            src={selectedUser.avatar}
                                                            alt={selectedUser.name || "User"}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                                                            {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-col max-w-[70%]">
                                            <div className="text-sm mb-1 flex items-center gap-2">
                                                <span className="font-semibold text-blue-400">
                                                    {isCurrentUser ? currentUser.name : selectedUser?.name || "User"}
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
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-100 dark:border-blue-900 overflow-hidden">
                                                    {currentUser?.avatar ? (
                                                        <img
                                                            src={currentUser.avatar}
                                                            alt={currentUser.name || "You"}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                                                            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
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

                <div className="mt-auto border-t border-gray-800">
                    <MessageInput sendMessage={sendMessage} />
                </div>
            </div>

            <VideoCall />
        </div>
    );
};

export default Chat;