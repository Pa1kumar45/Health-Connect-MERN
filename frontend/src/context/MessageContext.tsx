import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { Doctor, Message, Patient } from "../types/index";
import { useApp } from "./AppContext";

interface MessageContextType {
    messages: Message[] | null;
    setMessages: (messages: Message[] | null) => void;
    fetchMessages: (id: string) => Promise<void>;
    getSelectedUser: (id: string) => Promise<void>;
    selectedUser: Doctor | Patient | null;
    sendMessage: (recipientId: string, content: string, type?: 'text' | 'image') => Promise<void>;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [selectedUser, setSelectedUser] = useState<Doctor | Patient | null>(null);
    const { socket, currentUser } = useApp();

    const getSelectedUser = async (id: string) => {
        try {
            const userData = await axiosInstance.get(`/message/users/${id}`);
            setSelectedUser(userData.data.data);
        } catch (error) {
            console.error("Error fetching selected user:", error);
            throw error;
        }
    };

    const fetchMessages = async (id: string) => {
        try {
            const messagesData = await axiosInstance.get(`/message/${id}`);
            setMessages(messagesData.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    };

    const sendMessage = async (recipientId: string, content: string, type: 'text' | 'image' = 'text') => {
        if (!socket || !currentUser) return;

        try {
            // First save to database
            const response = await axiosInstance.post(`/message/send/${recipientId}`, {
                text: content,
                type
            });

            const newMessage = response.data.newMessage;

            // Then emit to socket for real-time update
            socket.emit('newMessage', {
                ...newMessage,
                receiverId: recipientId
            });

            // Update local state
            setMessages(prev => prev ? [...prev, newMessage] : [newMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    // Listen for new messages
    useEffect(() => {
        if (!socket || !currentUser || !selectedUser) return;

        const handleNewMessage = (message: Message) => {
            // Only update if message is part of current conversation
            if ((message.senderId === selectedUser._id && message.recipientId === currentUser._id) ||
                (message.senderId === currentUser._id && message.recipientId === selectedUser._id)) {
                console.log('Received message:', message);
                setMessages(prev => {
                    // Avoid duplicate messages
                    if (prev?.some(m => m._id === message._id)) {
                        return prev;
                    }
                    return prev ? [...prev, message] : [message];
                });
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, currentUser, selectedUser]);

    return (
        <MessageContext.Provider value={{
            messages,
            setMessages,
            fetchMessages,
            getSelectedUser,
            selectedUser,
            sendMessage
        }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};