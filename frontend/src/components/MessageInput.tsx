import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
    sendMessage: (data: { text?: string; image?: string }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && !isUploading) return;

        sendMessage({ text: message.trim() });
        setMessage('');
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            // TODO: Implement image upload functionality
            // const response = await uploadImage(formData);
            // sendMessage({ image: response.data.url });
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    disabled={isUploading}
                >
                    <Paperclip size={20} className="text-gray-400" />
                </button>
                
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isUploading}
                />
                
                <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={(!message.trim() && !isUploading) || isUploading}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;