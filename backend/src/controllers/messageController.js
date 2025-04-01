import { v2 } from "cloudinary";
import Message from "../models/Message.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

// import 
export const getUsers= async (req,res)=>{
    try {
    console.log("getusers hit");
    const {id}=req.params;

    var data;
    if(req.role=='doctor')
    data= await Patient.findById(id).select("-password");
    else
    data= await Doctor.findById(id).select("-password")
    console.log("get users",data);
    res.status(200).json({success:true,data:{...data.toObject,role:req.role}});
    } catch (error) {
        console.log("error in getting online users",error)
        res.status(500).json({success:false,message:"Internal error"})
    }
    
}


export const fetchMessages =async(req,res)=>{
    try {
        const {receiverId} = req.params;

        const senderId= req.user._id;
//        here we shoudl use await to prevent error s
// refer https://www.geeksforgeeks.org/mongodb-db-collection-find-method/
        const messages= await Message.find({$or:[
            {senderId:senderId,receiverId:receiverId},
            {receiverId:senderId,senderId:receiverId}
        ]})
        // console.log("fetced messages",messages)
        

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
            const uploadData= await v2.uploader.upload(image);
            imageUrl=uploadData.secure_url;

        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text,
            image:imageUrl,
        });
        newMessage.save();
        console.log("created message",newMessage);

        //impliment socket io

        res.status(201).json({success:true,newMessage})
    } catch (error) {
        console.log("failed to save message",error);
        res.status(500).json({success:false,message:error})
    }
}