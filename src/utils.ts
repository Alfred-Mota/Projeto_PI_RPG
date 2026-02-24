import type { Direction } from "./Person"

const utils = {
    withGrid : (position: number) => position*16,

    asGridCoords: (x:number, y:number) => `${x*16},${y*16}`,

    nextPosition: (currentX:number, currentY:number, direction:Direction)=>{
        let x = currentX
        let y = currentY
        const size = 16

        const map = {
            "down": [x, y+size],
            "up":   [x, y-size],
            "right": [x+size, y],
            "left": [x-size, y],
        }     
         
        return map[direction]
    },

    emitEvet : (name:string, detail:any)=>{
        const event = new CustomEvent(name, {detail})
        document.dispatchEvent(event)
    }

}

export default utils