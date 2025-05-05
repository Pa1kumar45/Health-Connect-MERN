import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

interface VideoCallContextType {
    isInCall: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    startCall: (userId: string) => Promise<void>;
    endCall: () => void;
    answerCall: () => Promise<void>;
    callStatus: 'idle' | 'calling' | 'ringing' | 'connected';
    callerId: string | null;
}

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket, currentUser } = useApp();
    const [isInCall, setIsInCall] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');
    const [callerId, setCallerId] = useState<string | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        if (!socket) return;

        const handleCallOffer = async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
            if (isInCall) {
                socket.emit('call-rejected', { to: data.from });
                return;
            }

            setCallerId(data.from);
            setCallStatus('ringing');

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);

                const pc = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' }
                    ]
                });

                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });

                pc.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                };

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', {
                            to: data.from,
                            candidate: event.candidate
                        });
                    }
                };

                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.emit('call-answer', {
                    to: data.from,
                    answer: answer
                });

                setPeerConnection(pc);
                setIsInCall(true);
                setCallStatus('connected');
            } catch (error) {
                console.error('Error handling call offer:', error);
                socket.emit('call-rejected', { to: data.from });
                setCallStatus('idle');
                setCallerId(null);
            }
        };

        const handleCallAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                setCallStatus('connected');
            }
        };

        const handleIceCandidate = (data: { candidate: RTCIceCandidateInit }) => {
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        };

        const handleCallEnd = () => {
            endCall();
        };

        socket.on('call-offer', handleCallOffer);
        socket.on('call-answer', handleCallAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('call-end', handleCallEnd);

        return () => {
            socket.off('call-offer', handleCallOffer);
            socket.off('call-answer', handleCallAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            socket.off('call-end', handleCallEnd);
        };
    }, [socket, isInCall, peerConnection]);

    const startCall = async (userId: string) => {
        if (isInCall) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            });

            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket?.emit('ice-candidate', {
                        to: userId,
                        candidate: event.candidate
                    });
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket?.emit('call-offer', {
                to: userId,
                offer: offer
            });

            setPeerConnection(pc);
            setIsInCall(true);
            setCallStatus('calling');
            setCallerId(userId);
        } catch (error) {
            console.error('Error starting call:', error);
            endCall();
        }
    };

    const answerCall = async () => {
        if (!callerId || !peerConnection) return;

        try {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket?.emit('call-answer', {
                to: callerId,
                answer: answer
            });

            setIsInCall(true);
            setCallStatus('connected');
        } catch (error) {
            console.error('Error answering call:', error);
            endCall();
        }
    };

    const endCall = () => {
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            setRemoteStream(null);
        }

        if (callerId) {
            socket?.emit('call-end', { to: callerId });
        }

        setIsInCall(false);
        setCallStatus('idle');
        setCallerId(null);
    };

    return (
        <VideoCallContext.Provider
            value={{
                isInCall,
                localStream,
                remoteStream,
                startCall,
                endCall,
                answerCall,
                callStatus,
                callerId
            }}
        >
            {children}
        </VideoCallContext.Provider>
    );
};

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (!context) {
        throw new Error('useVideoCall must be used within a VideoCallProvider');
    }
    return context;
}; 