import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext';
import { useMessage } from '../context/MessageContext';
import { formatMessageTime } from '../lib/utils';
import { Video } from 'lucide-react';
import { useVideoCall } from '../context/VideoCallContext';
import VideoCall from '../components/VideoCall';
import MessageInput from '../components/MessageInput';
import { Message } from '../types/index';

const Chat = () => {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useApp();
    const { fetchMessages, messages, getSelectedUser, selectedUser, sendMessage } = useMessage();
    const { startCall } = useVideoCall();
    
    const messageEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    
    // Fetch initial messages and user data
    useEffect(() => {
        if (id) {
            const loadChatData = async () => {
                try {
                    await Promise.all([
                        fetchMessages(id),
                        getSelectedUser(id)
                    ]);
                } catch (error) {
                    console.error("Error loading chat data:", error);
                }
            };
            loadChatData();
        }
    }, [id, fetchMessages, getSelectedUser]);

    // Handle scrolling
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
            setIsAutoScrollEnabled(isAtBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-scroll to bottom only when enabled
    useEffect(() => {
        if (isAutoScrollEnabled && messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAutoScrollEnabled]);

    const handleSendMessage = async (data: { text?: string; image?: string }) => {
        if (!id || (!data.text && !data.image)) return;
        
        try {
            if (data.image) {
                await sendMessage(id, data.image, 'image');
            } else if (data.text) {
                await sendMessage(id, data.text.trim(), 'text');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleVideoCall = () => {
        if (id) {
            startCall(id);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gray-900 text-gray-100">
            <div className="flex flex-col h-full">
                <div className="flex-none flex justify-end p-2 border-b border-gray-800">
                    {/* <button
                        onClick={handleVideoCall}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        <Video size={20} />
                    </button> */}
                </div>

                <div 
                    ref={chatContainerRef}
                    className="flex-1 min-h-0 overflow-y-auto px-2 py-2 md:px-4 md:py-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                >
                    {Array.isArray(messages) && messages.length > 0 ? (
                        <div className="space-y-3 pb-1">
                            {messages?.map((message: Message, index) => {
                                const isCurrentUser = message.senderId === currentUser?._id;
                                const isLastMessage = index === (messages?.length ?? 0) - 1;
                                
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

                <div className="flex-none border-t border-gray-800">
                    <MessageInput sendMessage={handleSendMessage} />
                </div>
            </div>

            <VideoCall />
        </div>
    );
};

export default Chat;