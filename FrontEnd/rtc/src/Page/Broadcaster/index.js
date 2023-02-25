
import "./index.css"
import React, { useRef, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://192.168.1.25:9800";




const Broadcaster = () => {


  const videoEl = useRef(null)
  const peerConnections = useRef(new RTCPeerConnection(null));
  const parseVideoStram = useRef(null)
  // const text = useRef(null)



  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      }
    ]
  };


  const socket = socketIOClient(ENDPOINT)



  React.useEffect(() => {



    getUserMedia()

    socket.emit("broadcaster")

    socket.on("watcher", (id) => {

      createOffer(id)

    })




    socket.on("answer", (answer) => {

      // text.current.value = JSON.stringify(answer)
      createRemoteDescription(answer)

    })




  }, [])





  const getUserMedia = (pc) => {


    // get "getUserMedia" function for other browsers
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    console.log(navigator.mediaDevices)

    if (navigator.mediaDevices) { // if navigator.mediaDevices exists, use it
      var constrainedWidth = 320,
        constrainedHeight = 180;

      var video_constraints = {
        "mandatory": {
          "minWidth": constrainedWidth,
          "minHeight": constrainedHeight,
          "minFrameRate": "30"
        },
        "optional": []
      }
      navigator.mediaDevices.getUserMedia({
        video: video_constraints,
        audio: false
      })
        .then(stream => {


          let video = videoEl.current
          video.srcObject = stream

          parseVideoStram.current = stream
          //  stream.getTracks().forEach(tracks => { peerConnections.current.addTrack(tracks, stream) })
          video.play()
        })
        .then(() => {
          console.log("add track success")
        })
        .catch(error => console.error("error", error));

    } else {
      // navigator.getUserMedia({audio: true}, );
      console.log("user media error")
    }






  }


  const createOffer = (watcherId) => {

    const pc = new RTCPeerConnection()


    peerConnections.current = pc


    parseVideoStram.current.getTracks().forEach(tracks => { pc.addTrack(tracks, parseVideoStram.current) })

    pc.onconnectionstatechange = e => {
      console.log("status :", e.currentTarget.connectionState)
    }


    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("candidate", watcherId, e.candidate)
      }

    }

    peerConnections.current.createOffer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 1
    })
      .then((sdp) => {

        let parseSDP = JSON.stringify(sdp)
        // console.log(JSON.stringify(sdp))
        // text.current.value = JSON.stringify(sdp)
        peerConnections.current.setLocalDescription(sdp);
        socket.emit("offer", watcherId, parseSDP);

      })
      .then(() => {
        console.log("succes create offer")
      })
      .catch((error) => {
        console.log("failed create offer with error : ", error)
      })
  }



  const createAnswewr = () => {
    peerConnections.current.createAnswer()
      .then((sdp) => {
        console.log(JSON.stringify(sdp))
        peerConnections.current.setLocalDescription(sdp);
      })
  }




  const createRemoteDescription = (answer) => {


    peerConnections.current.setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => {
        console.log("success createRemoteDescription")
      })
      .catch((error) => {
        console.log("failed createRemoteDescription with error : ", error)
      })


  }


  // const addIceCandidate = () => {

  //   const value = JSON.parse(text.current.value);

  //   peerConnections.current.addIceCandidate(new RTCIceCandidate(value))


  // }




  return (
    <div className="broadcaster" >
      <div className="header">
        <h1 style={{ textAlign: "left", marginLeft: 20, }}>webRTC</h1>
      </div>

      {/* <textarea ref={text} style={{ width: 600, height: 500, margin: 10 }} />
      <button onClick={createOffer}>create Offer</button>
      <button onClick={createAnswewr}>create Answer</button>
      <button onClick={createRemoteDescription}>create remote Description</button>
      <button onClick={addIceCandidate}>add ice candidate</button>
      <video autoPlay style={{ width: 300, height: 300 }} ref={videoEl} /> */}

      <div className="body">

        <video className="video" autoPlay ref={videoEl} />
        <div className="chat">abc</div>
        <div className="input">
          <input className="textfield"></input>
          <button  style={{width:100,height:34,outline:"none",border:"none"}}>send</button>
        </div>
      </div>
    </div>
  )
}

export default Broadcaster;