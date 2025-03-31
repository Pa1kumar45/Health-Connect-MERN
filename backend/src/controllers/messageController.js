import { v2 } from "cloudinary";
import Message from "../models/Message";
import Patient from "../models/Patient";

// import 
export const getUsers= async (req,res)=>{
    try {
        
    const Id=req.Id;

    const onlineUsers= await Patient.find({_id:{$ne:Id}}).select("-password");

    res.status(200).json({success:true,onlineUsers});
    } catch (error) {
        console.log("error in getting online users",error)
        res.status(500).json({success:false,message:"Internal error"})
    }
    
}


export const fetchMessages =async(req,res)=>{
    try {
        const {receiverId} = req.params;

        const senderId= req.Id;

        const messages= Message.find({$or:[
            {senderId:senderId,receiverId:receiverId},
            {receiverId:senderId,senderId:receiverId}
        ]})

        res.status(200).json({success:true,messages});
        
    } catch (error) {
        console.log("error in fethcing messages");
        res.status(500).json({success:false,message:error})
    }
}


export const sendMessage =async(req,res)=>{
    try {
        const senderId=req.Id;
        const {receiverId}=req.params;

        const {text,image}=req.body;
        let imageUrl;
        if(image){
            const uploadData= await v2.uploader.upload(image);
            imageUrl=uploadData.secure_url;

        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text,
            image:imageUrl,
        });

        //impliment socket io

        res.status(201).json({success:true,newMessage})
    } catch (error) {
        console.log("failed to save message",error);
        res.status(500).json({success:false,message:error})
    }
}