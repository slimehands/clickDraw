import type { playerFace, gameFace } from "./utility";
import { id } from "./utility";
import * as peerjs from "peerjs"
import type { packetToHost, packetToClient } from "./utility";
export class NonHost implements gameFace {
    // change 3 in the future
    readonly peer: peerjs.Peer
    private userName: string
    private hostId: string
    private conn: peerjs.DataConnection | undefined;
    message(conn: peerjs.DataConnection | undefined, mes:packetToHost){
        if(conn){
            if (conn.open){
            console.log(mes)
            conn.send(mes)
            }
            else{
                console.log("we arent open to" + conn.connectionId)
            }
        }
        else{
            console.log("conn does not exist idk")
        }
        
    }
    constructor(intf: playerFace){
        this.userName = intf.userName;
        this.peer = new peerjs.Peer({debug: 3})
        
        this.hostId = id(intf.gameCode)
        
        this.peer.on('open', ()=>{
            this.conn = this.peer.connect(this.hostId)
            console.log("connecting to " + this.hostId);
            this.conn.on("open",()=> 
            {
                console.log("were open")
                this.message(this.conn, {data:{userName: this.userName}, type: "join"})
            })   
            
            this.conn.on("data",(data: packetToClient)=>{
            
                console.log("data");
                if(data.type == 'set'){
                    intf.on.set(data.data.delay)
                }
                else if(data.type == 'again'){
                    intf.on.again()
                }
            })
            this.conn.on('close', () => console.log("Connection closed."));
            this.conn.on('error', (err) => console.error("Connection error:", err)); 
        })
         
    }
/*
if(data.type == 'set'){
                        intf.on.set(data.data.delay)
                    }
                    else if(data.type == 'again'){
                        intf.on.again()
                    }
*/
           
        
        
    
    public click(time:number){
    this.message(this.conn, {type:'click', data:{userName: this.userName,time}})
    }
    public ready(){
    this.message(this.conn, {type:'ready', data:{userName: this.userName}})
    }
    

}