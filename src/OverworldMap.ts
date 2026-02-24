import { GameObject } from "./GameObject";
import { Person, type Direction } from "./Person";
import utils from "./utils";
import { OverworlEvent, type EventObject } from "./OverworlEvent";

interface OverworldMapConfig{
    //O mapa superior, telhados, copas de arvores...
    upperSrc: string
    
    //Um array com todos os objetos do mapa atual
    gameObjects : Record<string, GameObject>;
    
    //O mapa inferior, o chão
    lowerSrc : string

    //As paredes do jogo
    walls?: Record<string,boolean>
}
 

export class OverworldMap{
    upperImage: HTMLImageElement
    
    gameObjects : Record<string, GameObject>

    lowerImage: HTMLImageElement

    walls: Record<string,boolean>

    isCutscenePlaying: boolean = false
    constructor(config:OverworldMapConfig){
        //Imagem superior
        this.upperImage = new Image()
        this.upperImage.src = config.upperSrc

        //As paredes do mapa
        this.walls = config.walls || {}

        //Imagem inferior
        this.lowerImage = new Image()
        this.lowerImage.src = config.lowerSrc

        this.gameObjects = config.gameObjects

    }

    isSpaceTaken(currentX:number, currentY:number, direction:Direction){
        const [nextX,nextY] = utils.nextPosition(currentX,currentY,direction)  
        return this.walls[`${nextX},${nextY}`] || false
    }

    drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson:any){
        ctx.drawImage(this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.positionX,
            utils.withGrid(6) - cameraPerson.positionY,
        )
    }

    drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson:any){
        ctx.drawImage(this.upperImage,
            utils.withGrid(10.5) - cameraPerson.positionX,
            utils.withGrid(6) - cameraPerson.positionY
        )
    }

    async startCutscene(events:EventObject[]){
        this.isCutscenePlaying = true

        for(let i = 0; i < events.length; i++){
            const eventConfig = events[i]

            const eventHandler = new OverworlEvent({event:eventConfig, map:this})

            await eventHandler.init()
            
        }

        this.isCutscenePlaying = false

        Object.values(this.gameObjects).forEach(gameObject =>{
            gameObject.doBehaviorEvent(this)
        })
        
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach(key=>{
            
            let gameObject = this.gameObjects[key]
            gameObject.id = key
            
            gameObject.mount(this)
        })
    }

    addWall(x:number,y:number){
        
        this.walls[`${x},${y}`] = true
    }
    removeWall(x:number,y:number){
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX:number,wasY:number, direction:Direction){
        this.removeWall(wasX, wasY)
        const [x,y] = utils.nextPosition(wasX, wasY, direction)
        
        this.addWall(x,y)
    }
}

//Objeto com os mapas

declare global{
    interface Window{
        OverworldMaps: Record<string, OverworldMapConfig>
    }
}

window.OverworldMaps = {
    DemoRoom:{
        upperSrc: "/images/maps/DemoUpper.png",
        lowerSrc: "/images/maps/DemoLower.png",
        walls:{
            [utils.asGridCoords(7,5)]:true,
            [utils.asGridCoords(8,4)]:true,
            [utils.asGridCoords(7,4)]:true,
            [utils.asGridCoords(8,5)]:true,
        },
        gameObjects:{
            hero:new Person({
                positionX:utils.withGrid(5),
                positionY:utils.withGrid(5),
                src: "/images/characters/people/hero.png",
                direction:"right",
                isPlayerControlled:true
            }),
            npc1: new Person({
                positionX:utils.withGrid(7),
                positionY:utils.withGrid(6),
                src: "/images/characters/people/npc1.png",
                direction:"down",
                behaviorLoop:[
                    {type:"stand", direction:"left", time:1200},
                    {type:"stand", direction:"up", time:1200},
                    {type:"stand", direction:"right", time:1200},
                    {type:"stand", direction:"down", time:500},
                ]
            }),
            npc2: new Person({
                positionX:utils.withGrid(4),
                positionY:utils.withGrid(7),
                src: "/images/characters/people/npc2.png",
                direction:"down",
                behaviorLoop:[
                    {type:"walk", direction:"left"},
                    // {type:"stand", direction:"up", time:800},
                    {type:"walk", direction:"up"},
                    {type:"walk", direction:"right"},
                    {type:"walk", direction:"down"},
                ]
            }),
            
        }
    },
    Kitchen:{
        upperSrc: "/images/maps/KitchenUpper.png",
        lowerSrc: "/images/maps/KitchenLower.png",
        gameObjects:{
            hero: new Person({
            positionX:5,
            positionY:10,
            src: "/images/characters/people/hero.png",
            direction:"down"
            }),
            npcA: new Person({
                positionX:2,
                positionY:2,
                src: "/images/characters/people/npc2.png",
                direction:"down"
            }),
            npcB: new Person({
                positionX:7,
                positionY:2,
                src: "/images/characters/people/npc3.png",
                direction:"down"
            }),
        }
    },
}