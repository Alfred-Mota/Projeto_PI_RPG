import type { OverworldMap } from "./OverworldMap";
import type { Direction, Person } from "./Person";

type Events = "walk"|"stand"

export type EventObject = {
    //Tipo do evento
    type: Events,
    //Direção
    direction? : Direction,
    //Tempo
    time? : number
    //Quem iniciou o evento
    who: string | null
    //Tentar alguma ação novamente
    retry?:boolean
}

interface OverworlEventConfig{
    event: EventObject,
    map: OverworldMap
}

export class OverworlEvent{
    event: EventObject
    map: OverworldMap

    constructor(config: OverworlEventConfig){
        this.event = config.event
        this.map = config.map
    }


    stand(resolve: () => void){
        const who = this.map.gameObjects[this.event.who!] as Person
        const event = {
            type:"stand",
            direction: this.event.direction,
            time: this.event.time
        }

        who.startBehavior({map:this.map},event)

        const completeHandler = (e:any)=>{
            //Varios personagens vao chamar esse evento, porem queremos apenas um em especifico por vez
            
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonStandComplete",completeHandler)
                resolve()
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler)
    }

    walk(resolve: () => void){
        const who = this.map.gameObjects[this.event.who!] as Person
        const event = {
            type:"walk",
            direction: this.event.direction
        }

        who.startBehavior({map:this.map},event)

        const completeHandler = (e:any)=>{
            //Varios personagens vao chamar esse evento, porem queremos apenas um em especifico por vez
            
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonWalkComplete",completeHandler)
                resolve()
            }
        }

        document.addEventListener("PersonWalkComplete", completeHandler)
    }

    init():Promise<void>{
        return new Promise<void>((resolve)=>{
            this[this.event.type as Events](resolve)
        }) 
    }
}