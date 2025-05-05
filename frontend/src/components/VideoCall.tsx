import React, { useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useVideoCall } from '../context/VideoCallContext';

const VideoCall: React.FC = () => {
    const { localStream, remoteStream, endCall, callStatus, callerId } = useVideoCall();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    if (callStatus === 'idle') return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-4xl h-[80vh] relative">
                <button
                    onClick={endCall}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    {/* Local Video */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                            You
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                            {callStatus === 'calling' ? 'Calling...' : 'Connected'}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
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