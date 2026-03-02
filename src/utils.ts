import type { LogoItem } from "./Mural"
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
    },

    oppositeDirection: (direction: Direction) =>{

         const map = {
            "down": "up",
            "up":   "down",
            "right": "left",
            "left": "right",
        }  

        return map[direction]
    },

    wait: (ms:number) =>{
        return new Promise<void>((resolve)=>{
            setTimeout(()=>resolve(), ms)
        })
    }

}

export default utils

export const demoLogos:LogoItem[] = [
    {
        name: "Porandu",
        src: "/images/logos_extensoes/PORANDU.png",
        description: "Projeto responsável por levar tecnologia e inovação ao setor agropecuário, otimizando processos no campo.",
    },
    {
        name: "SkillFull",
        src: "/images/logos_extensoes/skillfull.png",
        description: "Plataforma focada no desenvolvimento de habilidades técnicas e cursos profissionalizantes para a comunidade.",
    },
    {
        name: "Atlética",
        src: "/images/logos_extensoes/atletica.png",
        description: "Associação voltada ao fomento do esporte universitário e integração entre os estudantes através de competições.",
    },
    {
        name: "Inovatos",
        src: "/images/logos_extensoes/inovatos.png",
        description: "Empresa junior, responsavel por realizar projetos e serviços",
    },
    {
        name: "RoboPatos",
        src: "/images/logos_extensoes/roboPatos.png",
        description: "Extensão voltada ao estudo de robotica e programação",
    },
    {
        name: "Pomar",
        src: "/images/logos_extensoes/pomar.png",
        description: "...",
    },
];