 import { DirectionInput } from "./DirectionInput"
import { KeyPressListener } from "./KeyPressListener"
import { OverworldMap, type OverworldMapConfig } from "./OverworldMap"

interface OverworldConfig{
    //Elemento DIV que contem o elemento CANVAS
    element: HTMLElement
}

export class Overworld{
    element: HTMLElement
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    map: OverworldMap | null
    directionInput: DirectionInput | null

    constructor(config : OverworldConfig){

        this.element = config.element
        this.canvas = this.element.querySelector(".canvas-container") as HTMLCanvasElement
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
        this.map = null
        this.directionInput = null
    }

    startGameLoop(){
        const step = () =>{ 

            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            //Camera person
            const cameraPerson = this.map?.gameObjects.hero
            
            Object.values(this.map?.gameObjects!).forEach(gameObject =>{
                    gameObject.update({
                        arrow: this.directionInput?.direction,
                        map: this.map
                    }) 
            
            
            //Desenhamos a camada inferior
            this.map?.drawLowerImage(this.ctx, cameraPerson)
            Object.values(this.map?.gameObjects!).forEach(gameObject =>{
                    gameObject.sprite.draw(this.ctx, cameraPerson)
            })
            })

            //Desenhamos a camada superior
            this.map?.drawUpperImage(this.ctx, cameraPerson)

            requestAnimationFrame(step)
        }

        step()
    }

    bindActionInput(){
        //Verificando cenas especiais pelo mapa
        const callback = ()=>{
            this.map!.checkForActionCutscene()
        }
        new KeyPressListener({keyCode: "Enter",  callback})
    }

    checkHeroPosition(){
        document.addEventListener("PersonWalkComplete", (e:any)=>{
            if(e.detail.whoId === "hero"){
                
                this.map?.checkForFootstepCutscene()
            }
        })
    }

    startMap(mapConfig: OverworldMapConfig){
        this.map = new OverworldMap(mapConfig)
        this.map.overworld = this
        this.map.mountObjects()
    }

    init(){
        this.startMap(window.OverworldMaps.Dinner)
        this.bindActionInput()
        this.checkHeroPosition()
        this.directionInput = new DirectionInput()
        this.directionInput.init()
        this.startGameLoop()
        
        this.map!.startCutscene([
            {type:"changeMap", map:"DemoRoom"},

            // {type:"walk", direction:"left", who:"hero"},
            // {type:"walk", direction:"right", who:"npc1"},
            // {type:"walk", direction:"left", who:"hero"},
            // {type:"walk", direction:"right", who:"npc1"},
            // {type:"stand", direction:"right", who:"hero"},
            // {type:"stand", direction:"left", who:"npc1"},
            // {type:"walk", direction:"right", who:"npc1"},
            // {type:"textMessage", text:"Ola pessoal"},
        ])
    }
}