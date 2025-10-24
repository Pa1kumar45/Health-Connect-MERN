import Message from "../models/Message.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { getSocketId, io } from "../lib/socket.js";
import cloudinary from '../lib/cloudinary.js';

// import 
export const getUsers = async (req, res) => {
    try {
        const { id } = req.params;

        // Search in both collections
        const [patient, doctor] = await Promise.all([
            Patient.findById(id).select("-password"),
            Doctor.findById(id).select("-password")
        ]);

        if (!patient && !doctor) {
            return res.status(404).json({
                success: false,
                message: "User not found in either collection"
            });
        }

        // Determine which user was found and their role
        const foundUser = patient || doctor;
        const userRole = patient ? 'patient' : 'doctor';

        res.status(200).json({
            success: true,
            data: {
                ...foundUser.toObject(),
                role: userRole
            }
        });
    } catch (error) {
        console.error("Error in getting user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const fetchMessages =async(req,res)=>{
    try {
        const {receiverId} = req.params;

        const senderId= req.user._id;
//        here we shoudl use await to prevent error s
// refer https://www.geeksforgeeks.org/mongodb-db-collection-find-method/
        const messages= await Message.find({$or:[
            {senderId:senderId,receiverId:receiverId},
            {receiverId:senderId,senderId:receiverId}
        ]}).sort({ createdAt: 1 }); // Sort by creation time ascending
        

        res.status(200).json({success:true,messages});
        
    } catch (error) {
        console.log("error in fethcing messages",error);
        res.status(500).json({success:false,message:error})
    }
}


export const sendMessage =async(req,res)=>{
    try {
        const senderId=req.user._id;
        const {receiverId}=req.params;

        const {text,image}=req.body;
        let imageUrl;
        if(image){
            const uploadData= await cloudinary.uploader.upload(image);
            imageUrl=uploadData.secure_url;
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text,
            image:imageUrl,
        });
        await newMessage.save();
        
        // Emit to receiver
        const receiverSocketId=getSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        
        // Also emit to sender (for multi-device support or if sender is in chat)
        const senderSocketId=getSocketId(senderId.toString());
        if(senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json({success:true,newMessage})
    } catch (error) {
        console.log("failed to save message",error);
        res.status(500).json({success:false,message:error})
    }
}