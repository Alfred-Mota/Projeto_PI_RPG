import utils from "../utils";
import type { Battle } from "./Battle";
import type { EventObject } from "./BattleEvent";
import type { Combatant } from "./Combatant";
interface TurnCycleConfig{
    //Acesso a batalha
    battle: Battle,
    //Metodo para iniciar novo evento
    onNewEvent: (event:EventObject)=>Promise<any>,

    onWinner: ()=>void
}

export class TurnCycle{

    battle: Battle
    onNewEvent: (event:EventObject)=>Promise<any>
    onWinner: ()=>void
    currentTeam:"player" | "enemy" = "player"
    constructor(config:TurnCycleConfig){
        this.battle = config.battle
        this.onNewEvent = config.onNewEvent
        this.onWinner = config.onWinner
    }

    async turn(){
        //O dono da Rodada
        const casterId = this.battle.activeCombatant[this.currentTeam]
        const caster = this.battle.combatants[casterId] as Combatant
        //Inimigo
        const enemyId = this.battle.activeCombatant[caster.team === "player" ? "enemy":"player"]
        const enemy = this.battle.combatants[enemyId] as Combatant

        const submission:any = await this.onNewEvent({
            type:"submissionMenu",
            caster,
            enemy
        })

        const resultingEvent:EventObject[] = submission.action.succes

        for(let i=0; i<resultingEvent.length; i++){
            let event = {
                ...resultingEvent[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target
            }

            await this.onNewEvent(event)
        }

        if(this.battle.combatants[enemyId].hp <= 0){
            await this.onNewEvent({
                type:"textMessage",
                text:`${enemy.id} foi derrotado`
            })

            if(enemy.team === "enemy"){
                const gainXp =(caster.givesXp + caster.xp)
                const xpTotal =gainXp > 100 ? gainXp-100 : gainXp


                caster.update({
                    xp: xpTotal,
                })

                await this.onNewEvent({
                    type:"textMessage",
                    text:`Foram ganhos ${caster.givesXp} XP`
                })
               
                this.onWinner()
            }
        }

        if (!this.battle.isBattleOver) {
            this.currentTeam = this.currentTeam === "player" ? "enemy":"player"
            await this.turn();
        }
    }

    async init(){

        await this.onNewEvent({
            type:"textMessage",
            text:"A batalha vai começar!!!"
        })

        this.turn()
    }
}