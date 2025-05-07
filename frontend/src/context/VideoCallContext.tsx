import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';

// WebRTC configuration
const peerConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

interface VideoCallContextType {
  isInCall: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (userId: string) => Promise<void>;
  endCall: () => void;
  answerCall: () => Promise<void>;
  callStatus: 'idle' | 'calling' | 'ringing' | 'connected';
  callerId: string | null;
  rejectCall: () => void;
}

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useApp();
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');
  const [callerId, setCallerId] = useState<string | null>(null);
  
  // WebRTC connection reference
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  // Cleanup function
  const cleanupCall = () => {
    console.log('Cleaning up call resources');
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    pendingCandidatesRef.current = [];
    pendingOfferRef.current = null;
    setCallStatus('idle');
    setIsInCall(false);
  };

  // Create a new RTCPeerConnection
  const createPeerConnection = () => {
    console.log('Creating new peer connection');
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    
    // Set up event handlers
    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate && socket && callerId) {
        console.log('Sending ICE candidate:', candidate);
        socket.emit('ice-candidate', {
          to: callerId,
          candidate
        });
      }
    };
    
    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
      if (
        peerConnection.iceConnectionState === 'disconnected' ||
        peerConnection.iceConnectionState === 'failed' ||
        peerConnection.iceConnectionState === 'closed'
      ) {
        console.log('ICE connection failed or closed');
        cleanupCall();
      }
    };
    
    peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };
    
    return peerConnection;
  };

  // Start a call (as initiator)
  const startCall = async (userId: string) => {
    if (isInCall || !socket) {
      console.error('Cannot start call: already in call or socket not initialized');
      return;
    }
    
    try {
      console.log('Starting call to user:', userId);
      setCallerId(userId);
      setCallStatus('calling');
      setIsInCall(true);
      
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setLocalStream(stream);
      
      // Create new peer connection
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;
      
      // Add local tracks to the connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
      
      // Create and send offer
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await peerConnection.setLocalDescription(offer);
      
      console.log('Sending call offer to:', userId);
      socket.emit('call-user', {
        to: userId,
        offer: peerConnection.localDescription
      });
      
      // Set up socket listeners for this call
      socket.once('call-answered', async (data) => {
        if (!peerConnectionRef.current) return;
        
        console.log('Call answered, setting remote description');
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
          
          setCallStatus('connected');
          
          // Apply any pending ICE candidates
          pendingCandidatesRef.current.forEach(candidate => {
            if (peerConnectionRef.current) {
              peerConnectionRef.current.addIceCandidate(candidate);
            }
          });
          pendingCandidatesRef.current = [];
          
        } catch (error) {
          console.error('Error setting remote description:', error);
          cleanupCall();
        }
      });
      
      socket.once('call-rejected', () => {
        console.log('Call was rejected');
        cleanupCall();
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      cleanupCall();
    }
  };

  // Answer an incoming call
  const answerCall = async () => {
    if (!socket || !callerId || !pendingOfferRef.current) {
      console.error('Cannot answer call: missing required data');
      return;
    }
    
    try {
      console.log('Answering call from:', callerId);
      setCallStatus('connected');
      
      // Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      
      // Create peer connection
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;
      
      // Add local tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
      
      // Set the remote description (offer)
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(pendingOfferRef.current)
      );
      
      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      console.log('Sending call answer');
      socket.emit('answer-call', {
        to: callerId,
        answer: peerConnection.localDescription
      });
      
      // Apply any pending ICE candidates
      pendingCandidatesRef.current.forEach(candidate => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addIceCandidate(candidate);
        }
      });
      pendingCandidatesRef.current = [];
      
    } catch (error) {
      console.error('Error answering call:', error);
      cleanupCall();
    }
  };

  // Reject an incoming call
  const rejectCall = () => {
    if (socket && callerId) {
      console.log('Rejecting call from:', callerId);
      socket.emit('call-rejected', { to: callerId });
    }
    cleanupCall();
  };

  // End an ongoing call
  const endCall = () => {
    if (socket && callerId) {
      console.log('Ending call with:', callerId);
      socket.emit('call-end', { to: callerId });
    }
    cleanupCall();
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Handle incoming call
    const handleCallOffer = (data) => {
      console.log('Received call offer from:', data.from);
      
      if (isInCall) {
        console.log('Already in call, rejecting new call');
        socket.emit('call-rejected', { to: data.from });
        return;
      }
      
      setCallerId(data.from);
      setCallStatus('ringing');
      setIsInCall(true);
      pendingOfferRef.current = data.offer;
    };
    
    // Handle ICE candidates
    const handleIceCandidate = (data) => {
      console.log('Received ICE candidate');
      
      const candidate = new RTCIceCandidate(data.candidate);
      
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        console.log('Adding ICE candidate directly');
        peerConnectionRef.current.addIceCandidate(candidate);
      } else {
        console.log('Storing ICE candidate for later');
        pendingCandidatesRef.current.push(candidate);
      }
    };
    
    // Handle call end
    const handleCallEnd = () => {
      console.log('Remote peer ended the call');
      cleanupCall();
    };
    
    // Register event listeners
    socket.on('call-made', handleCallOffer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-end', handleCallEnd);
    
    // Cleanup event listeners
    return () => {
      socket.off('call-made', handleCallOffer);
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
      callerId,
      rejectCall
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