import type { GameObject } from "./GameObject"
import utils from "./utils";

type SpriteConfig = {
    //Objeto com as animações de cada GameObjects/ Conjunto de animações do objeto
    animations: Record<string, number[][]> | null;

    //Imagem atual do objeto
    currentAnimation: string | null;

    //Guarda qual o frame atual do objeto
    currentAnimationFrame: number | null;

    //Endeço da folha de imagens do objeto
    src:string

    //O objeto do jogo a ser renderizado
    gameObject: GameObject

    //Tempo de cada frame
    animationFrameLimit?: number
}

export class Sprite{
    animations: Record<string, number[][]>
    currentAnimation: string
    currentAnimationFrame: number
    image: HTMLImageElement
    shadow: HTMLImageElement
    isLoad: boolean = false
    gameObject: GameObject
    useShadow: boolean
    isLoadShadow:boolean = false
    animationFrameLimit: number
    animationFrameProgress: number

    constructor(config:SpriteConfig){

        this.image = new Image()
         this.image.onload = ()=>{
            this.isLoad = true
        }

        this.image.onerror = ()=>{
            console.log(`Não foi possivel carregar a imagem: ${this.image.src}`)
        }

        this.image.src = config.src
        
        this.shadow = new Image()
        this.useShadow = true // config.useShadow || false

        if(this.useShadow){
            this.shadow.src = "/images/characters/shadow.png"

            this.shadow.onload = ()=>{
                this.isLoadShadow = true
            }
            
        } 

        this.animations = config.animations || {
            "idle-down":[
                [0,0]
            ],
           "walk-down":[
                [1,0],[2,0],[3,0],[0,0] 
           ],
           "idle-up":[
                [0,2]
           ],
           "walk-up":[
                [0,2],[1,2],[2,2],[3,2]
           ],
           "idle-left":[
                [0,3]
           ],
           "walk-left":[
                [0,3],[1,3],[2,3],[3,3]
           ],
           "idle-right":[
                [0,1]
           ],
           "walk-right":[
                [0,1],[1,1],[2,1],[3,1]
           ],

        }

        this.currentAnimation = "walk-up" //config.currentAnimation || "idle-down"
        this.currentAnimationFrame = config.currentAnimationFrame || 0

        this.animationFrameLimit = config.animationFrameLimit || 16
        this.animationFrameProgress = this.animationFrameLimit

        this.gameObject = config.gameObject
    }

    get frame(){
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    updateAnimationFrame(){

        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -=1
            return
        }

        this.animationFrameProgress = this.animationFrameLimit

        this.currentAnimationFrame +=1
        if(this.frame === undefined){
            this.currentAnimationFrame = 0
        }
    }

    setAnimation(key:string){
        
        if(key !== this.currentAnimation){ 
            this.currentAnimation = key
            this.animationFrameProgress = this.animationFrameLimit
            this.currentAnimationFrame = 0
        }
    }

    draw(ctx: CanvasRenderingContext2D, cameraPerson:any){

        const x = this.gameObject.positionX - 8 + utils.withGrid(10.5) - cameraPerson.positionX
        const y = this.gameObject.positionY + 16 + utils.withGrid(6) - cameraPerson.positionY
        this.isLoadShadow && ctx.drawImage(this.shadow,x,y)

        const [frameX, frameY] = this.frame

        this.isLoad && ctx.drawImage(this.image,
            frameX*32, frameY*32,
            32,32,
            x,y ,
            32,32
        )

        this.updateAnimationFrame()
    }
}