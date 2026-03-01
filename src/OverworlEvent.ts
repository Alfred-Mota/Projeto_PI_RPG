import { Battle } from "./Battle/Battle";
import { BooksMural } from "./BooksMural";
import type { OverworldMap } from "./OverworldMap";
import type { Direction, Person } from "./Person";
import { SceneTransition } from "./SceneTransition";
import { TextMessage } from "./TextMessage";
import utils from "./utils";
type Events = "walk"|"stand"|"textMessage"|"changeMap"|"mural"|"battle"

export type EventObject = {
    //Tipo do evento
    type: Events,
    //Direção
    direction? : Direction,
    //Tempo
    time? : number
    //Quem iniciou o evento
    who?: string 
    //Tentar alguma ação novamente
    retry?:boolean
    //texto ou mensagem
    text?:string
    //
    faceHero?:string

    //
    map?:string

    //
    enemy?:string

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
            direction: this.event.direction,
            retry: true
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

    textMessage(resolve: ()=>void){

        if(this.event.faceHero){
            const person = this.map.gameObjects[this.event.faceHero] as Person
            person.direction = utils.oppositeDirection(this.map.gameObjects.hero.direction) as Direction
        }

        const message = new TextMessage({
            text: this.event.text!,
            onComplete: resolve
        })

        message.init(document.querySelector(".game-container") as HTMLElement)
    }

    changeMap(resolve: ()=>void){
        const sceneTransition = new SceneTransition()
        const callback = ()=>{ 
            this.map.overworld?.startMap(window.OverworldMaps[this.event.map!])
            resolve()
        }

        sceneTransition.init(document.querySelector(".game-container") as HTMLElement, callback)
        
    }

    mural(resolve: ()=>void){
        const muralBooks = new BooksMural({onComplete: resolve})
        muralBooks.init(document.querySelector(".game-container") as HTMLElement)
    }

    battle(resolve:()=>void){
        const sceneTransition = new SceneTransition()
        const enemy = this.map.gameObjects[this.event.who!] as Person
        const battle = new Battle({onComplete:resolve,enemy})
        const callback = ()=>{ 
            battle.init(document.querySelector(".game-container") as HTMLElement)
        }
        sceneTransition.init(document.querySelector(".game-container") as HTMLElement, callback)
    }

    init():Promise<void>{
        return new Promise<void>((resolve)=>{
            this[this.event.type as Events](resolve)
        }) 
    }
}