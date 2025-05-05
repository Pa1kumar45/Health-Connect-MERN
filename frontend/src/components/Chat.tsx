import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Message } from '../types';

interface ChatProps {
    recipientId: string;
    recipientName: string;
}

const Chat: React.FC<ChatProps> = ({ recipientId, recipientName }) => {
    const { socket, currentUser } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
        };
    }, [socket, recipientId]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !currentUser) return;

        const message: Message = {
            senderId: currentUser._id,
            recipientId,
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        socket.emit('message', message);
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
                            <p>{message.content}</p>
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
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat; 