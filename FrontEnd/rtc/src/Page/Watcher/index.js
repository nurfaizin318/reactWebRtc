
import React, { useEffect, useRef, useState } from "react";
import "./index.css"
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.1.25:9800";

const Watcher = () => {

  const socket = socketIOClient(ENDPOINT)

  const peerConnections = useRef(new RTCPeerConnection(null));
  const broadCasterID = useRef(null)
  const buttonRef = useRef(null)
  const candidate = useRef([])
  const text = useRef(null)
  const videoEl = useRef(null)

  // var peerConnection;
  const config = {

    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      }
    ]
  };



  React.useEffect(() => {



    const pc = new RTCPeerConnection();


    pc.ontrack = e => {

      console.log("ontrack", e.streams[0])

      const remoteStream = new MediaStream()
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track)
    

      })

      videoEl.current.srcObject = remoteStream;
    }


    socket.emit("watcher")

    //ketika broadcaster mengirimkan offer maka akan diterima oleh watcher disini
    //sdp digunakan untuk membuat remote description di wacther
    //sedangkan broadcasterID di gunakan untuk mengembalikan answer kepada broadcaster 

    socket.on("offer", (broadcasterID, sdp) => {

      broadCasterID.current = broadcasterID
      createRemoteDescription(sdp)

    })


    socket.on("candidate", candidate => {
      addIceCandidate(candidate)
      // console.log("candidate",candidate)
    })


    peerConnections.current = pc

  }, [])



  const createOffer = () => {
    peerConnections.current.createOffer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 1
    })
      .then((sdp) => {
        // console.log(JSON.stringify(sdp))
        peerConnections.current.setLocalDescription(sdp);
      })
  }


  const createRemoteDescription = (broadcasterSDP) => {

    const value = JSON.parse(broadcasterSDP);

    peerConnections.current.setRemoteDescription(new RTCSessionDescription(value))
      .then(() => {
        console.log("sucess create remote descriprion")
      })
      .then(() => {
        createAnswewr()
      })
      .catch((error) => {
        console.log("failed setRemoteDescription with error :", error)
      })



  }


  const createAnswewr = () => {

    peerConnections.current.createAnswer()
      .then((sdp) => {

        peerConnections.current.setLocalDescription(sdp);
        socket.emit("answer", broadCasterID.current, sdp)
        // text.current.value = JSON.stringify(sdp)
      })
      .then(() => {
        console.log("success create answer")
      })
      .catch((error) => {
        console.log("failed create answer with error : ", error)
      })
  }




  const addIceCandidate = (candidate) => {



    peerConnections.current.addIceCandidate(new RTCIceCandidate(candidate))
      .then(() => {
        console.log("success add candidate")
      })
      .catch((error) => {
        console.log("failed add candidate with error : ", error)
      })


  }

  return (
    <div className="watcher">
   

      {/* <textarea ref={text} style={{ width: 600, height: 500, margin: 10 }} />
  
      <button onClick={createOffer}>create Offer</button>
      <button onClick={createAnswewr}>create Answer</button>
      <button onClick={createRemoteDescription}>create remote Description</button>
      <button onClick={addIceCandidate} ref={buttonRef}>add ice candidate</button>
       <video  autoPlay controls style={{ width: 300, height: 300, backgroundColor: "blue" }} ref={videoEl} /> */}

      <div className="body">

        <video className="video" autoPlay controls ref={videoEl} />
        <div className="chat">abc</div>
        <div className="input">
          <input className="textfield"></input>
          <button style={{ width: 100, height: 34, outline: "none", border: "none" }}>send</button>
        </div>
      </div>
    </div>

  )
}

export default Watcher;