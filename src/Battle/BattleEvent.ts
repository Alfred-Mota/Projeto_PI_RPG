import { ANIMATIONS } from "../Content/AttacksAnimation";
import { TextMessage } from "../TextMessage";
import utils from "../utils";
import type { Battle } from "./Battle";
import type { Combatant } from "./Combatant";
import { SubmissionMenu } from "./SubmissionMenu";

interface BattleEventConfig{
    battle: Battle
    event: EventObject
}

type Events = "textMessage"|"submissionMenu"|"changeState"|"animation"

export type EventObject = {
    type:Events
    text?:string
    caster?: Combatant
    target?: Combatant
    enemy?: Combatant
    damage?:number
    action?:Record<string,any>
    animationFn?: "roboPunch"|"highGain"|"book"
}

export class BattleEvent{
    battle: Battle
    event: EventObject

    constructor(config:BattleEventConfig){
        this.battle = config.battle
        this.event = config.event
    }

    textMessage(resolve: (result?: any) => any){

        const text = this.event.text!.replace("{CASTER}", this.event.caster?.id!)

        const textMessage = new TextMessage({
            onComplete:resolve,
            text
        })

        // textMessage.init(document.querySelector(".game-container") as HTMLElement)
        textMessage.init(this.battle.element as HTMLElement)
    }
    
    async changeState(resolve:(results?:any)=>any){
        const {caster, target, damage} = this.event

        if(damage){
            target?.update({
                hp: target.hp - damage
            })
        }

        await utils.wait(600)
        
        resolve()
    }

    submissionMenu(resolve: (result?: any) => any){
        const menu = new SubmissionMenu({
            caster:this.event.caster!,
            enemy: this.event.enemy!,
            onComplete: (submission:any) => resolve(submission)
        })

        menu.init(this.battle.element as HTMLElement)
    }

    async animation(resolve: (result?: any) => any) {
    const { caster, target, damage, animationFn } = this.event;

    await new Promise(onComplete => {
        const fn = ANIMATIONS[animationFn!];
        fn(this.battle,this.event, onComplete);
    });
    // 3. Limpeza pós-animação
    this.battle.element?.querySelector(`.Battle_${target?.team}`)!.classList.remove("battle-damage-blink");
    
    // 4. Resolve o evento de batalha original

    this.battle.element?.querySelector(`.Attack`)!.remove()

    resolve();

    }

    init(resolve: (result?: any) => any){
        this[this.event.type](resolve)
    }
}