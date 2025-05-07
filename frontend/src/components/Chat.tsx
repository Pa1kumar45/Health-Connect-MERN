import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, AlertCircle, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { axiosInstance } from '../utils/axios';

interface Message {
    _id?: string;
    senderId: string;
    recipientId: string;
    text?: string;
    content?: string;
    timestamp: string;
    image?: string;
}

interface ChatProps {
    recipientId: string;
    recipientName: string;
}

const Chat: React.FC<ChatProps> = ({ recipientId, recipientName }) => {
    const { socket, currentUser } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message: Message) => {
            if (message.senderId === recipientId || message.recipientId === recipientId) {
                setMessages(prev => [...prev, message]);
            }
        };

        socket.on('newMessage', handleMessage);

        return () => {
            socket.off('newMessage', handleMessage);
        };
    }, [socket, recipientId]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);

            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Image = reader.result as string;

                // Send message with image
                if (socket && currentUser) {
                    try {
                        const response = await axiosInstance.post(`/message/send/${recipientId}`, {
                            image: base64Image
                        });

                        const newMessage = response.data.newMessage;
                        socket.emit('newMessage', newMessage);
                        setMessages(prev => [...prev, newMessage]);
                    } catch (error) {
                        console.error('Error sending image:', error);
                        setError('Failed to send image. Please try again.');
                    }
                }
            };
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Failed to process image. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !currentUser) return;

        const message: Message = {
            senderId: currentUser._id,
            recipientId,
            text: newMessage,
            timestamp: new Date().toISOString()
        };

        socket.emit('newMessage', message);
        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="flex-none p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Chat with {recipientName}
                    </h2>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.senderId === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderId === currentUser?._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                        >
                            {message.image && (
                                <div className="mb-2">
                                    <img 
                                        src={message.image} 
                                        alt="Sent" 
                                        className="max-w-full rounded-lg"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            {(message.text || message.content) && (
                                <p>{message.text || message.content}</p>
                            )}
                            <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-none p-4 border-t dark:border-gray-700">
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-400 text-red-700 shadow-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        disabled={isUploading}
                    >
                        <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isUploading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={(!newMessage.trim() && !isUploading) || isUploading}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;