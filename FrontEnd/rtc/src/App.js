import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";
import React from 'react';
import Router from "./Router"

// const ENDPOINT = "http://127.0.0.1:4000";




function App() {

  const peerConnections = {};
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

// const socket = socketIOClient(ENDPOINT);




  React.useEffect(() => {

    // socket.on("watcher", id => {
    //   const peerConnection = new RTCPeerConnection(config);
    //   peerConnections[id] = peerConnection;
    
     
        
    //   peerConnection.onicecandidate = event => {
    //     if (event.candidate) {
    //       socket.emit("candidate", id, event.candidate);
    //     }
    //   };
    
    //   peerConnection
    //     .createOffer()
    //     .then(sdp => peerConnection.setLocalDescription(sdp))
    //     .then(() => {
    //       socket.emit("offer", id, peerConnection.localDescription);
    //     });
    // });
    
    // socket.on("answer", (id, description) => {
    //   peerConnections[id].setRemoteDescription(description);
    // });
    
    // socket.on("candidate", (id, candidate) => {
    //   peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    // });

 
  

    return () => {

      // socket.off('connect');
      // socket.off('disconnect');
      // socket.off('answer');
      // socket.off('candidate');
   
   
    };
  }, []);
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
