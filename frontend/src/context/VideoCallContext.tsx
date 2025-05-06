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
    
    // Queue for ICE candidates received before remoteDescription is set
    const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

    // Clean up all call state and media
    const cleanupCall = () => {
        console.log('[WebRTC] Cleaning up call');
        if (peerConnectionRef.current) {
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
        pendingCandidates.current = [];
    };

    // Create a new RTCPeerConnection and set up handlers
    const createPeerConnection = async () => {
        console.log('[WebRTC] Creating new RTCPeerConnection');
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun4.l.google.com:19302' }
                // ,
                // { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });
        // Add local tracks to the peer connection
        const stream =await startMyVedio();

        stream?.getTracks().forEach(track => pc.addTrack(track, stream));
        // When a remote track is received, set it as remoteStream
        pc.ontrack = (event) => {
            console.log('[WebRTC] ontrack event', event);
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
                console.log('[WebRTC] Remote stream set');
            }
        };
        // When an ICE candidate is found, send it to the peer
        pc.onicecandidate = (event) => {
            if (event.candidate && callerId) {
                console.log('[WebRTC] Sending ICE candidate', event.candidate);
                socket?.emit('ice-candidate', { to: callerId, candidate: event.candidate });
            }
        };
        pc.onconnectionstatechange = () => {
            console.log('[WebRTC] Connection state:', pc.connectionState);
            if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                cleanupCall();
            }
        };
        //one more
        peerConnectionRef.current = pc;
        return pc;
    };

    const startMyVedio = async() => {
        if (localStream) return;
        console.log('[WebRTC] Getting local media for caller');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        console.log("stream ",stream)
        return stream;
     
    };

    // Start a call as the caller
    const startCall = async (userId: string) => {
        if (isInCall) return;
        try {
            setCallerId(userId); // Set before anything else
            console.log("user id ",userId)
            setCallStatus('calling');
            setIsInCall(true);         
            const pc = await createPeerConnection();
            console.log('[WebRTC] Creating offer');
            const offer = await pc.createOffer();
            console.log('[WebRTC] Setting local description for offer', offer);
            await pc.setLocalDescription(offer);
            console.log('[WebRTC] Sending offer to', userId);
            socket?.emit('call-user', { to: userId, offer: pc.localDescription });
        } catch (error) {
            console.error('[WebRTC] Error starting call', error);
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
            console.log('[WebRTC] Creating answer');
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log('[WebRTC] Sending answer to', callerId);
            socket?.emit('answer-call', { to: callerId, answer:pc.localDescription });
        } catch (error) {
            console.error('[WebRTC] Error answering call', error);
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
        // Handle receiving a call offer
        const handleCallOffer = async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
            if (isInCall) {
                socket.emit('call-rejected', { to: data.from });
                return;
            }
            setCallerId(data.from);
            setCallStatus('ringing');
            setIsInCall(true);
          // Ensure receiver is brought to the video call page
            try {
                console.log('[WebRTC] Getting local media for receiver');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                const pc = await createPeerConnection();
                console.log('[WebRTC] Setting remote offer');
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                // Add any ICE candidates received before remoteDescription was set
                // for (const candidate of pendingCandidates.current) {
                //     try {
                //         await pc.addIceCandidate(new RTCIceCandidate(candidate));
                //         console.log('[WebRTC] Added queued ICE candidate', candidate);
                //     } catch (e) {
                //         console.warn('[WebRTC] Failed to add queued ICE candidate', candidate, e);
                //     }
                // }
                // pendingCandidates.current = [];
                peerConnectionRef.current = pc;
            } catch (error) {
                console.error('[WebRTC] Error handling call offer', error);
                socket.emit('call-rejected', { to: data.from });
                cleanupCall();
            }
        };
        // Handle receiving a call answer
        const handleCallAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
            const pc = peerConnectionRef.current;
            if (pc) {
                try {
                    console.log('[WebRTC] Setting remote answer');
                    console.log(data.answer)
                    await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                    // Add any ICE candidates received before remoteDescription was set
                    // for (const candidate of pendingCandidates.current) {
                    //     try {
                    //         await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    //         console.log('[WebRTC] Added queued ICE candidate', candidate);
                    //     } catch (e) {
                    //         console.warn('[WebRTC] Failed to add queued ICE candidate', candidate, e);
                    //     }
                    // }
                    // pendingCandidates.current = [];
                } catch (e) {
                    console.error('[WebRTC] Error setting remote answer', e);
                }
                setCallStatus('connected');
            }
        };
        // Handle receiving an ICE candidate
        const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
            const pc = peerConnectionRef.current;
            if (pc) {
                // if (pc.remoteDescription && pc.remoteDescription.type) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                        console.log('[WebRTC] Added ICE candidate', data.candidate);
                    } catch (e) {
                        console.warn('[WebRTC] Failed to add ICE candidate', data.candidate, e);
                    }
                // } else {
                //     // Queue ICE candidates until remoteDescription is set
                //     console.log('[WebRTC] Queuing ICE candidate', data.candidate);
                //     pendingCandidates.current.push(data.candidate);
                // }
            }
        };
        // Handle call end
        const handleCallEnd = () => {
            console.log('[WebRTC] Call ended by remote');
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