import type { Battle } from "../Battle/Battle";
import type { EventObject } from "../Battle/BattleEvent"
import utils from "../utils"

const roboPunch = (battle:Battle,event: EventObject, onComplete: (result?: any) => any) => {
    const team = event.caster?.team;
    // Dica: Use seletores mais específicos para não pegar o robô errado
    const element = document.querySelector(`[attack-name=Hydraulic-Strike][team=${team}]`) as HTMLElement;
    const img = element?.querySelector("img");

    img?.setAttribute("walk", `walk-animation`);
    element?.setAttribute("animation", `move-${team}`);
   
    element!.addEventListener("animationend", async () => {
        img!.removeAttribute("walk");
        battle.element?.querySelector(`.Battle_${event.target?.team}`)!.classList.add("battle-damage-blink")

        img?.setAttribute("walk", "walk-animation");
        element?.setAttribute("animation", `come-back-${team}`);
        element!.addEventListener("animationend", () => {
            img!.removeAttribute("walk");
            element!.removeAttribute("animation");
            onComplete(); // ✅ SÓ COMPLETA AQUI, depois de voltar
        }, { once: true });

    }, { once: true });
}

const highGain = async (battle:Battle,event: EventObject, onComplete: (result?: any) => any) => {
    const team = event.caster?.team;
    const container = document.querySelector(".Battle") as HTMLElement;
    const beam = document.createElement("div");
    beam.classList.add("High-Gain-Ray-Beam")
    beam.setAttribute("team", `${team}`)

    container.appendChild(beam);
    beam.addEventListener("animationend", async () => {
        battle.element?.querySelector(`.Battle_${event.target?.team}`)!.classList.add("battle-damage-blink")
        
        await utils.wait(2000)
        beam.remove();
        onComplete(); // ✅ COMPLETA quando o raio sumir
    }, { once: true });
}

const book = async (battle:Battle,event: EventObject, onComplete: (result?: any) => any)=>{
    const team = event.caster!.team;
    const book = document.querySelector(`[attack-name=Headshot]`) as HTMLElement
    book.setAttribute('team', team)
    
    book.addEventListener("animationend", ()=>{
        onComplete()
    }, {once:true})

}


export const ANIMATIONS = {
    "roboPunch":roboPunch,
    "highGain":highGain,
    "book":book
} 