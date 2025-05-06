import React, { useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useVideoCall } from '../context/VideoCallContext';

const VideoCall: React.FC = () => {
    const { localStream, remoteStream, endCall, callStatus, answerCall } = useVideoCall();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900 rounded-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gray-800">
                    <span className="text-white text-lg font-semibold">Video Call</span>
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
                    {/* Answer Call Button (if ringing) */}
                    {callStatus === 'ringing' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button
                                onClick={answerCall}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold shadow-lg"
                            >
                                Answer Call
                            </button>
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