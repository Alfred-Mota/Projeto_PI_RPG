import { GameObject, type GameObjectConfig } from "./GameObject";

interface PersonConfig extends GameObjectConfig{
    isPlayerControlled?:boolean
}
type Property = "positionY" | "positionX"
export type Direction = "up" | "down" | "left" | "right";

export class Person extends GameObject{
    movingProgressRemaining:number
    directionUpdate: Record<Direction, (Property|number)[]>
    isPlayerControlled:boolean
    constructor(config : PersonConfig){
        super(config)

        this.movingProgressRemaining = 0
        this.isPlayerControlled = config.isPlayerControlled || false
        this.directionUpdate = {
            "down": ["positionY",1],
            "up":   ["positionY", -1],
            "right": ["positionX", 1],
            "left": ["positionX", -1],
        }
    }

    update(state:any): void {
        if(this.movingProgressRemaining > 0){
            this.updatePosition()

        }else{

            //Mais casos para andar
            //
            //

            if(this.movingProgressRemaining === 0 && state.arrow && this.isPlayerControlled){
                this.startBehavior(state,{
                    type:"walk",
                    direction: state.arrow
                })
            }

            this.updateSprite()
        }
    }

    startBehavior(state:any, behavior:any){
        this.direction = behavior.direction as Direction  
        if(behavior.type === "walk"){

            if(state.map.isSpaceTaken(this.positionX, this.positionY,this.direction)) return
            state.map.moveWall(this.positionX,this.positionY, this.direction)
            this.movingProgressRemaining = 16
        }
        
    }

    updatePosition(){
        
            const direction = this.direction as Direction 
            const [property, value] = this.directionUpdate[direction] as [Property, number]
            (this[property] as number) += value
            this.movingProgressRemaining -= 1
        
    }

    updateSprite(){
        if(this.movingProgressRemaining > 0){ 
            this.sprite.setAnimation(`walk-${this.direction}`)
            return
        }
        
        this.sprite.setAnimation(`idle-${this.direction}`)
        


    }
}