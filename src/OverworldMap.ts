import { GameObject } from "./GameObject";
import { Person, type Direction } from "./Person";
import utils from "./utils";

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

    mountObjects(){
        Object.values(this.gameObjects).forEach(gameObject=>{
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
            positionY:utils.withGrid(0),
            src: "/images/characters/people/hero.png",
            direction:"right",
            isPlayerControlled:true
            }),
            npc1: new Person({
                positionX:utils.withGrid(7),
                positionY:utils.withGrid(0),
                src: "/images/characters/people/npc1.png",
                direction:"down"
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