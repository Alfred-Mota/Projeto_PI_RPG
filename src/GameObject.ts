import type { OverworldMap } from "./OverworldMap"
import { Sprite } from "./Sprite"

export interface GameObjectConfig {
    //As coordenadas do objeto
    positionX: number
    positionY: number

    //Endeço da folha de imagens do objeto
    src:string

    //Direção do objeto
    direction: string
}

export class GameObject{
    positionX: number
    positionY: number
    sprite: Sprite
    direction: string
    isMounted: boolean = false
    constructor(config:GameObjectConfig){
        this.positionX = config.positionX || 0
        this.positionY = config.positionX || 0
        this.direction = config.direction || "right"
        
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
        console.log("Mouting...")
        console.log(this.positionX, this.positionY)
        map.addWall(this.positionX, this.positionY)
    }

    update(state:any):void{

    }
}