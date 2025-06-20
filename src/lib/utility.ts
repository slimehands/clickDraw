import type Peer from "peerjs";


/**
 * Here you define these functions and send this to the host/nonHost constructor.
 * This doesn't change whether you are a host or client.
 */
export interface playerFace {
    readonly userName: string;
    on: {    
        set(arg0: number): void
        //winner(arg1: string, arg2: number)
        /* eslint-disable */
        event(event: unknown): void
        /* eslint-enable */
        again():void
        //done():void
        
    }
    readonly gameCode: number;
}
/**
 * This is what the constructor will return you. 
 * What these actually do does change, but it's not visible.
 * You are meant to call these in the rest of the svelte code.
 */
export interface gameFace {
    
        click(arg0: number): void
        ready():void
        //leave(): void
    
    peer: Peer
}

export function id(code: number){
    return "asdjfkl-click-draw-game-" + code 
}

interface joinPacket{
    type:"join"
    data: {
        userName: string
    }
}
interface readyPacket{
    type:"ready"
    data: {
        userName: string
    }
}
interface clickPacket{
    type: "click"
    data: {
        userName: string
        time: number
    }
}


export type packetToHost = joinPacket | readyPacket | clickPacket | imagePacket

interface imagePacket{
    type: "image"
    data: {
        userName: string
        image: Blob
    }
}


export type packetToClient = setPacket | donePacket | imagePacket | againPacket

interface setPacket{
    type:"set"
    data:{
        delay: number
    }
}
interface againPacket{
    type: "again"
}

interface donePacket{
    type: "done"
    data:{
        /**
         * winnner username and time
         */
        userName: string;
        time: number;
    }
}


export type player = {
    userName: string
    id?: string
    ready: boolean
    clickTime: null | number 
}