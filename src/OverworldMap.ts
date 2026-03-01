import { GameObject } from "./GameObject";
import { Person, type Direction } from "./Person";
import utils from "./utils";
import { OverworlEvent, type EventObject } from "./OverworlEvent";
import { Overworld } from "./Overworld";
export interface OverworldMapConfig{
    //O mapa superior, telhados, copas de arvores...
    upperSrc: string
    
    //Um array com todos os objetos do mapa atual
    gameObjects : Record<string, GameObject>;
    
    //O mapa inferior, o chão
    lowerSrc : string

    //As paredes do jogo
    walls?: Record<string,boolean>

    //Espaços especiais
    cutsceneSpaces?: Record<string, Record<string, EventObject[]>[]>
}
 

export class OverworldMap{
    upperImage: HTMLImageElement
    
    gameObjects : Record<string, GameObject>

    lowerImage: HTMLImageElement

    walls: Record<string,boolean>

    isCutscenePlaying: boolean = false

    cutsceneSpaces?: Record<string, Record<string, EventObject[]>[]>

    overworld: Overworld | null = null

    constructor(config:OverworldMapConfig){
        //Imagem superior
        this.upperImage = new Image()
        this.upperImage.src = config.upperSrc
        this.cutsceneSpaces = config.cutsceneSpaces || {}
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

    checkForActionCutscene(){
        const hero = this.gameObjects["hero"]
        const [nextX, nextY] = utils.nextPosition(hero.positionX, hero.positionY, hero.direction)
        const match = Object.values(this.gameObjects).find(gameObject =>{
            return gameObject.positionY === nextY && gameObject.positionX === nextX
        })

        if(!this.isCutscenePlaying && match && match instanceof Person){
            
            if(match.talking && match.talking?.length > 0){
                this.startCutscene(match.talking[0].events)
            }
        }
    }

    checkForFootstepCutscene(){
        const hero = this.gameObjects.hero as Person 
        const match = this.cutsceneSpaces![`${hero.positionX},${hero.positionY}`]
        if(!this.isCutscenePlaying && match ){
            this.startCutscene(match[0].events)
        }

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
        cutsceneSpaces:{
            [utils.asGridCoords(7,2)]:[
                {
                    events:[
                        {who:"npc2",type:"walk", direction:"left"},
                        {who:"npc2",type:"textMessage", text:"Você nao pode ir por ai !!"},

                        {who:"hero", type:"walk", direction:"down"},
                        {who:"hero", type:"walk", direction:"left"},
                        {who:"hero", type:"walk", direction:"left"},

                        {who:"npc2",type:"walk", direction:"right"},
                        {who:"npc2",type:"stand", direction:"left"},
                    ]
                }
            ],
            [utils.asGridCoords(5,8)]:[
                {
                    events:[
                        {type:"changeMap", map:"Kitchen"},
                        
                    ]
                }
            ],
            [utils.asGridCoords(3,2)]:[
                {
                    events:[
                        {type:"mural"},
                        
                    ]
                }
            ],
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
                ],
                talking:[
                   {
                    events:[
                        {type:"textMessage", text:"Estou cansado...", faceHero:"npc1"},
                        {type:"textMessage", text:"Já pode ir embora ?"},
                        {type:"battle", who:"npc1"},
                        {who:"hero",type:"walk", direction:"left"},
                        {who:"hero",type:"walk", direction:"up"},
                        {who:"hero",type:"walk", direction:"up"},
                        ]
                   }
                ]
            }),
            npc2: new Person({
                positionX:utils.withGrid(9),
                positionY:utils.withGrid(3),
                src: "/images/characters/people/npc2.png",
                direction:"down",
                behaviorLoop:[
                    {type:"walk", direction:"left"},
                    {type:"stand", direction:"up", time:800},
                    {type:"walk", direction:"up"},
                    {type:"walk", direction:"right"},
                    {type:"walk", direction:"down"},
                ],
                talking:[
                   {
                    events:[
                        {type:"textMessage", text:"npc1: Opa, bão?", faceHero:"npc2"},
                        {type:"textMessage", text:"hero: Joia :)"},
                        {type:"battle", enemy:"npc2"},
                        {who:"hero",type:"walk", direction:"left"},
                        {who:"hero",type:"walk", direction:"up"},
                        
                    ]
                   }
                ]
            }),
            
        }
    },
    Kitchen:{
        upperSrc: "/images/maps/KitchenUpper.png",
        lowerSrc: "/images/maps/KitchenLower.png",
        gameObjects:{
            hero: new Person({
            positionX:utils.withGrid(5),
            positionY:utils.withGrid(6),
            src: "/images/characters/people/hero.png",
            direction:"down",
            isPlayerControlled:true
            }),
            npcA: new Person({
                positionX:utils.withGrid(2),
                positionY:utils.withGrid(2),
                src: "/images/characters/people/npc2.png",
                direction:"down"
            }),
            npcB: new Person({
                positionX:utils.withGrid(7),
                positionY:utils.withGrid(2),
                src: "/images/characters/people/npc3.png",
                direction:"down"
            }),
        }
    },
    Dinner:{
        upperSrc: "/images/maps/DiningRoomUpper.png",
        lowerSrc: "/images/maps/DiningRoomLower.png",
         cutsceneSpaces:{
            [utils.asGridCoords(2,4)]:[
                {
                    events:[
                        {who:"hero",type:"stand",direction:"up"},
                        {who:"hero",type:"textMessage", text:"Ola, quanto é um cafe ?"},
                        {who:"npcA",type:"textMessage", text:"Ola, o cafe é 2,50R$"},
                        {who:"hero",type:"textMessage", text:"Muito caro, obrigado"},
                        {who:"hero",type:"walk",direction:"right"},
                    ]
                }
            ],
        },
        gameObjects:{
            hero: new Person({
            positionX:utils.withGrid(5),
            positionY:utils.withGrid(6),
            src: "/images/characters/people/hero.png",
            direction:"down",
            isPlayerControlled:true
            }),
            npcA: new Person({
                positionX:utils.withGrid(2),
                positionY:utils.withGrid(2),
                src: "/images/characters/people/npc2.png",
                direction:"down",
                talking:[
                   {
                    events:[
                        {type:"textMessage", text:"Estou cansado...", faceHero:"npcA"},
                        {type:"textMessage", text:"Já pode ir embora ?"},
                        {who:"hero",type:"walk", direction:"left"},
                        {who:"hero",type:"walk", direction:"up"},
                        {who:"hero",type:"walk", direction:"up"},
                        ]
                   }
                ]
            }),
            npcB: new Person({
                positionX:utils.withGrid(7),
                positionY:utils.withGrid(2),
                src: "/images/characters/people/npc3.png",
                direction:"down"
            }),
        }
    },
}