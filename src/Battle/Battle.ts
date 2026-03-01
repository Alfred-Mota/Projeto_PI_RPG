import { Combatant } from "./Combatant"
import { ATTACKS } from "../Content/Atacks"
import { TurnCycle } from "./TurnCycle"
import { BattleEvent, type EventObject } from "./BattleEvent"
import { SceneTransition } from "../SceneTransition"
import type { Person } from "../Person"
interface BattleConfig{
    onComplete: ()=>void
    enemy: Person
}

export class Battle{
    element: HTMLElement | null = null 
    onComplete: ()=>void
    combatants: Record<string, Combatant>
    activeCombatant: Record<string,string>
    sceneTransition: SceneTransition = new SceneTransition()
    isBattleOver:boolean = false;
    enemy: Person

    constructor(config:BattleConfig){
        this.onComplete = config.onComplete
        this.enemy = config.enemy
        this.activeCombatant = {
            player:"Hero",
            enemy: this.enemy.id!
        }

        this.combatants = {
            "Hero": new Combatant({
                attacks:{
                    highGain: ATTACKS.highGain,
                    headshot:ATTACKS.headshot
                },
                team:"player",
                hp:50,
                maxHp:50,
                xp:80,
                maxXp:100,
                level:1,
                battle:this,
                sponsorIcon:"/images/logos_extensoes/PORANDU.png",
                isControlledPlayer:true
            }),
            [`${this.enemy!.id}`]: new Combatant({
                
                attacks:{
                    strike:ATTACKS.strike
                },
                team:"enemy",
                hp:1,
                maxHp:50,
                xp:50,
                maxXp:100,
                level:2,
                battle:this,
                sponsorIcon:"/images/logos_extensoes/atletica.png"
            }),
        }
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("Battle")

        this.element.innerHTML = `
            <div class= 'Battle_player'>
                <img src=${'images/characters/people/hero.png'} alt='Hero'/>
            </div>

            <div class= 'Battle_enemy'>
                <img src=${this.enemy.src} alt = NPC/>
            </div>
        `
    }

    init(container: HTMLElement){
        this.createElement()
        container.appendChild(this.element!)

        Object.keys(this.combatants).forEach(key =>{
            const combatant = this.combatants[key]
            combatant.id = key
            combatant.init(this.element!)
        })
       
        const turn = new TurnCycle({
                battle:this,
                onNewEvent: (event: EventObject) => {
                    return new Promise<any>((resolve) => {
                        const battleEvent = new BattleEvent({
                            battle: this,
                            event
                        });
                        battleEvent.init(resolve);
                    });
                },
                onWinner: ()=>{
                    this.isBattleOver = true;
                    this.sceneTransition.init(this.element!, ()=>{
                        this.element!.remove()
                        this.onComplete()
                    })
                }
        })
        turn.init()
    }
}