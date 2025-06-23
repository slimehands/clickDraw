import type { playerFace, gameFace, packetToHost, player, packetToClient } from "./utility";
import { id } from "./utility";
import * as peerjs from "peerjs"


export class Host implements gameFace{
    readonly peer
    private players: player[] = new Array<player>
    public myId: string = "";
    private conn: peerjs.DataConnection | undefined;
    on: playerFace["on"]
    broadcast(data: packetToClient) {
        if (this.conn && this.conn.open) {
        this.conn.send(data);
        } else {
        console.warn("No open connection to send data.");
        }
    }
    
    private IamReady: boolean = false
    private myTime: number| null = null;
    
    ready(){
        this.IamReady = true
        this.checkReady(true)
    }
    checkReady(b: boolean){
        if(this.players.every((player) => player.ready) && b){
            const time = 3000 + Math.random() * 4000;
            this.broadcast({type:'set', data:{delay:time}})
            this.on.set(time)
        }
    }
    click(time:number){
        this.myTime = time;
        this.checkClicks()
    }
    checkClicks(){
        if(this.players.every((player) => player.clickTime != null) && this.myTime != null){
            console.log("checking clicks");
            //need to change this part later
            let min: number = Number.MAX_VALUE;
            let i = 0;
            this.players.forEach((element, index) => {
                if(element.clickTime  || 99999 < min){
                    min = element.clickTime || 999999;
                    i = index;
                }
            });
            
            const data = {userName : this.players[i].userName, time: min}
            this.broadcast({type:"done", data: data})
            console.log("fastest was");
            console.log(data);
            this.on.done(data.userName, data.time);
            
        }
    }
    

    // change 3 in the future
    constructor(intf: playerFace){
        this.on = intf.on;
        
        this.peer = new peerjs.Peer(id(intf.gameCode), {debug: 3})
        this.peer.on('open', (id) => {
            this.myId = id;
            console.log("me!")
            
        })
        
        this.peer.on('connection', (conn) => {
            this.conn = conn;
            intf.on.event(conn)
            console.log("connecting to" + conn.connectionId)
            
            conn.on('open', ()=>{
                console.log(conn.connectionId + "is open!")
            })
            conn.on('data', (data: packetToHost) => {
                console.log(data)
                intf.on.event(data)
                if(data.type == "join"){
                    this.players.push({userName: data.data.userName, id: conn.connectionId, ready: false, clickTime: null})
                    console.log("playerlist is now:")
                    console.log(this.players)
                }
                else if(data.type == "ready"){
                    console.log(data.data.userName + " says ready!")
                    const i = this.players.findIndex(player => player.userName == data.data.userName)
                    console.log(i + "in the list")
                    this.players[i].ready = true

                    this.checkReady(this.IamReady)
                }
                else if(data.type == "click"){
                    this.players[this.players.findIndex(player => player.userName == data.data.userName)].clickTime = data.data.time
                    this.checkClicks()
                }
                else if(data.type == "image"){
                    console.error("image unimplemented yet");
                }
            })
            conn.on('close', () => console.log("Connection closed."));
            conn.on('error', (err) => console.error("Connection error:", err));    
            })
        }
        



    }

    

       
     
     


