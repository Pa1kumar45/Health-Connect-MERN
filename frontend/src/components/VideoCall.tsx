import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useVideoCall } from '../context/VideoCallContext';

const VideoCall: React.FC = () => {
    const { localStream, remoteStream, endCall, callStatus, answerCall, rejectCall } = useVideoCall();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Debug: Log callStatus changes
    useEffect(() => {
        console.log("📞 VideoCall callStatus changed to:", callStatus);
    }, [callStatus]);

    const isWebRTCSupported = () => {
        return (
            navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
            typeof RTCPeerConnection !== 'undefined'
        );
    };

    const requestMediaPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Error accessing media devices:', err);
            alert('Please allow access to your camera and microphone.');
        }
    };

    useEffect(() => {
        if (!isWebRTCSupported()) {
            alert('WebRTC is not supported by your browser. Please try another browser.');
            return;
        }
        requestMediaPermissions();
    }, []);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            try {
                localVideoRef.current.srcObject = localStream;
            } catch (err) {
                console.error('Error binding local stream:', err);
            }
        }
    }, [localStream]);

    useEffect(() => {
        // Always show the remote stream when available
        if (remoteStream && remoteVideoRef.current) {
            // Only set srcObject if it's different to avoid interrupting playback
            if (remoteVideoRef.current.srcObject !== remoteStream) {
                try {
                    console.log("🎥 Setting remote stream:", remoteStream);
                    console.log("🎥 Remote stream tracks:", remoteStream.getTracks());
                    console.log("🎥 Remote stream active:", remoteStream.active);
                    console.log("🎥 Video element ref:", remoteVideoRef.current);
                    
                    remoteVideoRef.current.srcObject = remoteStream;
                    
                    // Force the video to play
                    remoteVideoRef.current.play().then(() => {
                        console.log("✅ Remote video playing successfully");
                    }).catch(err => {
                        console.error("❌ Error playing remote video:", err);
                    });
                } catch (err) {
                    console.error('Error binding remote stream:', err);
                }
            } else {
                console.log("🎥 Remote stream already set, skipping");
            }
        } else {
            console.log("⚠️ Remote stream or ref not available:", {
                hasRemoteStream: !!remoteStream,
                hasRemoteVideoRef: !!remoteVideoRef.current,
                callStatus
            });
        }
    }, [remoteStream, callStatus]);

    const toggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };


    //get the caller details from the context and show it in the header based on callerId
    // const getCallerDetails = () => {
    //     // Assuming you have a function to fetch caller details based on callerId
    //     // This is just a placeholder, replace with actual implementation
    //     return callerId ? `Call from ${callerId}` : 'Incoming Call';
    // }

    
    

    const handleRejectCall = () => {
        rejectCall();  // Reject the call and end the session
    };

    if (callStatus === 'idle') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900 rounded-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gray-800">
                    <span className="text-white text-lg font-semibold">Video Call from </span>
                    <button
                        onClick={endCall}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                {/* Main Video Area */}
                <div className="flex-1 relative">
                    {/* Remote Video (big) */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover bg-black"
                    />
                    {/* Debug indicator */}
                    {!remoteStream && callStatus === 'connected' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white bg-red-500 px-4 py-2 rounded">
                                Waiting for remote video...
                            </p>
                        </div>
                    )}
                    {/* Local Video (small box) */}
                    <div className="absolute bottom-6 right-6 w-1/4 max-w-[200px] aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Answer or Reject Call Button (if ringing) */}
                    {callStatus === 'ringing' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-white text-xl mb-4">Incoming call...</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={answerCall}
                                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold shadow-lg"
                                    >
                                        Answer Call
                                    </button>
                                    <button
                                        onClick={handleRejectCall}
                                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg font-semibold shadow-lg"
                                    >
                                        Reject Call
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Calling status (for caller) */}
                    {callStatus === 'calling' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-pulse">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-white text-xl">Calling...</p>
                                <p className="text-gray-300 text-sm">Waiting for answer</p>
                            </div>
                        </div>
                    )}
                </div>
                {/* Controls */}
                <div className="flex justify-center gap-4 p-4 bg-gray-800">
                    <button
                        onClick={toggleMute}
                        className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                        onClick={toggleVideo}
                        className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                    <button
                        onClick={endCall}
                        className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
