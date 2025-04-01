import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { Doctor, Message, Patient } from "../types";

interface MessageContextType {
    messages:Message[]|null;
    setMessages:(messages:Message[]|null)=>void;
    fetchMessages:(id:string)=>void;
    getSelectedUser:(id:string)=>void;

}

const MessageContext = createContext<MessageContextType|null>(null);

export const MessageProvider:React.FC<{children:React.ReactNode}>=({children})=>{
const [messages, setMessages] = useState<Message[] | null>(null);
const [selectedUser, setSelectedUser] = useState<Doctor|Patient|null>(null);

    const getSelectedUser= async(id:string)=>{
        const userData = await axiosInstance.get(`/message/users/${id}`);
        setSelectedUser(userData.data.data); 
        console.log("selected user",userData.data.data);
        
    }
    const fetchMessages = async(id:string)=>{
        const messagesData=await axiosInstance.get(`/message/${id}`);
        console.log("messages fetched",messagesData);
               setMessages(messagesData.data.messages);
    }
return(
    <MessageContext.Provider value={{messages,setMessages,fetchMessages,getSelectedUser}}>
        {children}
    </MessageContext.Provider>
)
}


export const useMessage =()=>{
    const context= useContext(MessageContext);
    if(context===undefined){
        throw new Error("use message can only be used inside Message Provider");

    }
    return context;
}