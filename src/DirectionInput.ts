type Direction = "up" | "down" | "right" | "left"

export class DirectionInput{
    heldDirection: string[]
    map: Record<string, Direction>

    constructor(){
        this.heldDirection = []
        this.map  = {
            "ArrowDown" :"down",
            "ArrowLeft":"left",
            "ArrowRight":"right",
            "ArrowUp": "up",
            "KeyS" :"down",
            "KeyA":"left",
            "KeyD":"right",
            "KeyW": "up"
        }
    }

    get direction(){ 
        return this.heldDirection[0]
    }

    init(){
        document.addEventListener("keydown", (e)=>{
            const key = e.code 
            const dir = this.map[key]
            if(dir && this.heldDirection?.indexOf(dir) == -1){
                this.heldDirection?.unshift(dir)
            }
        })

        document.addEventListener("keyup", (e)=>{
            const key = e.code 
            const dir = this.map[key]
            const index = this.heldDirection?.indexOf(dir)
            if(index  != -1){
                this.heldDirection?.splice(index!,1)
            }
        })
    }
}