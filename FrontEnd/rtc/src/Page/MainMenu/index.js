
import "./index.css"
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:9800";
const socket = socketIOClient(ENDPOINT,{
    transports:["http"]
  });

const Main = () =>{
    return (
        <div className="main">
            <input className="input" />
            <button className="button" onClick={()=>{
                 socket.emit("broadcaster")
            }}>create live stream</button>
            <div>Or</div>
            <button className="button" onClick={()=>{
                socket.emit("watcher","faiz")
            }}>join live</button>
        </div>
    )
}

export default Main;