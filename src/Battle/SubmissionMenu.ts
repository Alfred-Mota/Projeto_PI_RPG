import type { Combatant } from "./Combatant";
import { KeyBoardMenu } from "../KeyBoardMenu";

interface SubmissionMenuConfig{
    caster: Combatant,
    enemy: Combatant,
    onComplete: (result?: any) => any
}

export class SubmissionMenu{
    caster: Combatant
    enemy: Combatant
    onComplete: (result?: any) => any
    keyBoardMenu: KeyBoardMenu | null = null

    constructor(config:SubmissionMenuConfig){
        this.caster = config.caster
        this.enemy = config.enemy
        this.onComplete = config.onComplete
    }

    getPages(){
        const backOptions = {
            label:"Go Back",
            description:'Return to previous page',
            handler: ()=>{
                this.keyBoardMenu!.setOptions(this.getPages().root)
            }
        }
        return {

            root:[
                {
                    label:"Attacks",
                    description:"Escolha um ataque",
                    handler: ()=>{
                       console.log(this.caster)
                       this.keyBoardMenu?.setOptions(this.getPages().attacks)
                    }
                },
                {
                    label:"Items",
                    description:"Escolha um item",
                    handler: ()=>{
                        //Se for escolhido faça algo
                    }
                },
                {
                    label:"Outros",
                    description:"Sem opções por enquanto...",
                    handler: ()=>{
                        //Se for escolhido faça algo
                    }
                },
            ],
            attacks:[
                ...Object.keys(this.caster.attacks).map((key:any)=>{
                    const atc = this.caster.attacks[key]
                    return{
                            label:atc.name,
                            description: atc.description,
                            handler: ()=>{
                                this.menuSubmit(atc)
                            }
                        }
                }),
                
                backOptions
            ],
            items:{
                backOptions
            },
            others:{
                backOptions
            }
        }
    }

    menu(container:HTMLElement){
        this.keyBoardMenu = new KeyBoardMenu()
        this.keyBoardMenu.init(container)
        this.keyBoardMenu.setOptions(this.getPages().root)
    }

    embaralhar(array:any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Escolhe um índice aleatório de 0 a i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Troca os elementos usando destructuring
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

    decide(){
        const keys = Object.keys(this.caster.attacks)
        const key = this.embaralhar(keys)[0]
        const attack = this.caster.attacks[key]
        this.menuSubmit(attack)
    }

    menuSubmit(action:any){
        this.caster.isControlledPlayer && this.keyBoardMenu!.end()
        this.caster.startAttack(action)
        this.onComplete({
            action,
            target: this.enemy
        })
    }

    init(container:HTMLElement){
        if(this.caster.isControlledPlayer){
            //show menu
            this.menu(container)
        }else{
            //decisao por IA
            this.decide()
        }
    }
}