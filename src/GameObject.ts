import { OverworldMap } from "./OverworldMap"
import { Sprite } from "./Sprite"
import { OverworlEvent, type EventObject } from "./OverworlEvent"
import type { Direction } from "./Person"

export interface GameObjectConfig {
    //As coordenadas do objeto
    positionX: number
    positionY: number

    //Endeço da folha de imagens do objeto
    src:string

    //Direção do objeto
    direction: Direction

    //Loop de comportamentos
    behaviorLoop? : EventObject[]

    //
    talking?: Record<string, EventObject[]>[]
}

export class GameObject{
    positionX: number
    positionY: number
    sprite: Sprite
    direction: Direction
    isMounted: boolean = false
    //ID AULA 8
    id:string | null = null
    behaviorLoop : EventObject[]
    talking?: Record<string, EventObject[]>[]
    behaviorLoopIndex: number

    constructor(config:GameObjectConfig){
        this.positionX = config.positionX || 0
        this.positionY = config.positionY || 0
        this.direction = config.direction || "right"

        this.behaviorLoop = config.behaviorLoop || []
        this.behaviorLoopIndex = 0
        this.talking = config.talking || []
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            animations:null,
            currentAnimation:null,
            currentAnimationFrame:null
        })
    }

    mount(map: OverworldMap){
        this.isMounted = true 
        map.addWall(this.positionX, this.positionY)

        setTimeout(()=>{
            this.doBehaviorEvent(map)
        },20)
    }

    async doBehaviorEvent(map: OverworldMap){

        const isStanding = (this as any).isStanding === true

        if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || isStanding) return

        const eventConfig = this.behaviorLoop[this.behaviorLoopIndex] as EventObject
        eventConfig.who = this.id!
        
        const eventHandler = new OverworlEvent({map, event: eventConfig})
        await eventHandler.init()
         
        this.behaviorLoopIndex +=1
        if(this.behaviorLoop.length === this.behaviorLoopIndex) this.behaviorLoopIndex = 0
        
        this.doBehaviorEvent(map)
    }

    update(state:any):void{

    }
}