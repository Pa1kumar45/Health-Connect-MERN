import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
    const { socket } = useApp();
    const [isInCall, setIsInCall] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');
    const [callerId, setCallerId] = useState<string | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    // Clean up all call state and media
    const cleanupCall = () => {
        console.log('[WebRTC] Cleaning up call');
        if (peerConnectionRef.current) {
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        if (remoteStream) setRemoteStream(null);
        setIsInCall(false);
        setCallStatus('idle');
        setCallerId(null);
    };

    // Create or reuse a single peer connection instance per call
    const getOrCreatePeerConnection = () => {
        if (peerConnectionRef.current) return peerConnectionRef.current;
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });
        pc.onicecandidate = (event) => {
            if (event.candidate && callerId) {
                console.log('[WebRTC] Sending ICE candidate', event.candidate);
                socket?.emit('ice-candidate', { to: callerId, candidate: event.candidate });
            }
        };
        pc.ontrack = (event) => {
            console.log('[WebRTC] ontrack event', event);
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
                console.log('[WebRTC] Remote stream set:', event.streams[0]);
            }
        };
        pc.oniceconnectionstatechange = () => {
            console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
        };
        pc.onconnectionstatechange = () => {
            console.log('[WebRTC] Connection state:', pc.connectionState);
            if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                cleanupCall();
            }
        };
        peerConnectionRef.current = pc;
        return pc;
    };

    // Start a call as the caller
    const startCall = async (userId: string) => {
        if (isInCall) return;
        try {
            setCallerId(userId);
            setCallStatus('calling');
            setIsInCall(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            const pc = getOrCreatePeerConnection();
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.emit('call-user', { to: userId, offer: pc.localDescription });
        } catch (error) {
            cleanupCall();
        }
    };

    // Answer a call as the receiver
    const answerCall = async () => {
        if (!callerId || !peerConnectionRef.current) return;
        try {
            setCallStatus('connected');
            setIsInCall(true);
            const pc = peerConnectionRef.current;
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket?.emit('answer-call', { to: callerId, answer: pc.localDescription });
            setCallStatus('connected');
            console.log('[WebRTC] Call connected receiver side');
        } catch (error) {
            cleanupCall();
        }
    };

    // End the call
    const endCall = () => {
        if (callerId) {
            socket?.emit('call-end', { to: callerId });
        }
        cleanupCall();
    };

    // Handle signaling events
    useEffect(() => {
        if (!socket) return;
        const handleCallOffer = async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
            if (isInCall) {
                socket.emit('call-rejected', { to: data.from });
                return;
            }
            setCallerId(data.from);
            setCallStatus('ringing');
            setIsInCall(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                const pc = getOrCreatePeerConnection();
                stream.getTracks().forEach(track => pc.addTrack(track, stream));
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            } catch (error) {
                socket.emit('call-rejected', { to: data.from });
                cleanupCall();
            }
        };
        const handleCallAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
            console.log('[WebRTC] Call answered', data.answer);
            const pc = peerConnectionRef.current;
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                setCallStatus('connected');
                console.log('[WebRTC] Call connected caller side');
            }
        };
        const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
            const pc = peerConnectionRef.current;
            if (pc) {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        };
        const handleCallEnd = () => {
            cleanupCall();
        };
        socket.on('call-made', handleCallOffer);
        socket.on('call-answered', handleCallAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('call-end', handleCallEnd);
        return () => {
            socket.off('call-made', handleCallOffer);
            socket.off('call-answered', handleCallAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            socket.off('call-end', handleCallEnd);
        };
    }, [socket, isInCall]);

    return (
        <VideoCallContext.Provider value={{
            isInCall,
            localStream,
            remoteStream,
            startCall,
            endCall,
            answerCall,
            callStatus,
            callerId
        }}>
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