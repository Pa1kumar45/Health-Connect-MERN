import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { Doctor, Message, Patient } from "../types";
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

        const message = {
            senderId: currentUser._id,
            recipientId,
            text: content,
            timestamp: new Date().toISOString(),
            type
        };

        try {
            // Emit to socket first for real-time update
            socket.emit('newMessage', message);
            
            // Then save to database
            await axiosInstance.post(`/message/send/${recipientId}`, {
                text: content,
                type
            });

            // Update local state
            setMessages(prev => prev ? [...prev, message] : [message]);
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    // Listen for new messages
    useEffect(() => {
        if (!socket || !currentUser) return;

        const handleNewMessage = (message: Message) => {
            if (message.senderId === selectedUser?._id || message.recipientId === selectedUser?._id) {
                setMessages(prev => prev ? [...prev, message] : [message]);
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