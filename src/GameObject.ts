import { OverworldMap } from "./OverworldMap"
import { Sprite } from "./Sprite"
import { OverworlEvent, type EventObject } from "./OverworlEvent"

export interface GameObjectConfig {
    //As coordenadas do objeto
    positionX: number
    positionY: number

    //Endeço da folha de imagens do objeto
    src:string

    //Direção do objeto
    direction: string

    //Loop de comportamentos
    behaviorLoop? : Record<string,any>[]
}

export class GameObject{
    positionX: number
    positionY: number
    sprite: Sprite
    direction: string
    isMounted: boolean = false
    //ID AULA 8
    id:string | null = null
    behaviorLoop : Record<string,any>[]
    behaviorLoopIndex: number

    constructor(config:GameObjectConfig){
        this.positionX = config.positionX || 0
        this.positionY = config.positionY || 0
        this.direction = config.direction || "right"

        this.behaviorLoop = config.behaviorLoop || []
        this.behaviorLoopIndex = 0

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

        if(map.isCutscenePlaying || this.behaviorLoop.length === 0) return

        const eventConfig = this.behaviorLoop[this.behaviorLoopIndex] as EventObject
        eventConfig.who = this.id
        
        const eventHandler = new OverworlEvent({map, event: eventConfig})
        await eventHandler.init()
         
        this.behaviorLoopIndex +=1
        if(this.behaviorLoop.length === this.behaviorLoopIndex) this.behaviorLoopIndex = 0
        
        this.doBehaviorEvent(map)
    }

    update(state:any):void{

    }
}