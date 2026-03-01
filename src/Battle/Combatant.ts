import type { Battle } from "./Battle";

interface CombatantConfig{
    //Acesso há batalha
    battle: Battle

    //Caracteristicas do combatente
    hp:number,
    maxHp:number,
    xp:number,
    maxXp:number,
    level:number,
    id?:string
    //time
    team:string

    //atacks
    attacks ?: Record<string, any>

    //patrocinador
    sponsorIcon?: string

    //Player controller
    isControlledPlayer?:boolean
}

export class Combatant{
    battle: Battle
    hp:number
    maxHp:number
    xp:number
    maxXp:number
    level:number
    team:string
    element: HTMLElement | null = null
    attack: HTMLElement | null = null
    activeAttack: HTMLImageElement | null = null
    attacks : Record<string, any>
    id:string | null = null
    sponsorIcon?: string
    hpFills : NodeListOf<SVGRectElement> | null = null
    xpFills : NodeListOf<SVGRectElement> | null = null

    isControlledPlayer?:boolean

    constructor(config:CombatantConfig){
        this.battle = config.battle
        this.hp = config.hp
        this.xp = config.xp
        this.maxHp = config.maxHp
        this.maxXp = config.maxXp
        this.level = config.level
        this.team = config.team
        this.attacks = config.attacks || {}
        this.id = config.id || null
        this.sponsorIcon = config.sponsorIcon || ""
        this.isControlledPlayer = config.isControlledPlayer || false

    }

    createElement(){
        this.element = document.createElement('div')
        this.element.classList.add('Combatant')
        this.element.setAttribute('data-team', this.team)

        this.element.innerHTML = (`
            <p class="Combatant_name"> ${this.id} </p>
            <p class="Combatant_level"></p>

            <img class="Combatant_sponsor" src="${this.sponsorIcon}"/>

            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>

            <svg viewBox="0 0 26 2" class="Combatant_xp-container">
                <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
                <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
            </svg>
            `)
        
        // this.attack = document.createElement("div")
        // this.attack.classList.add('Attack')
        // this.attack.setAttribute('attack-name', this.firtsAttack.name)
        // this.attack.setAttribute('team', this.team)
        
        // this.activeAttack = document.createElement('img')
        // this.attack.appendChild(this.activeAttack)

        // this.activeAttack.setAttribute('src', this.firtsAttack.src)
        // this.activeAttack.setAttribute('alt', this.firtsAttack.name)
            
        this.hpFills = this.element!.querySelectorAll(".Combatant_life-container > rect")
        this.xpFills = this.element!.querySelectorAll(".Combatant_xp-container > rect")
    }

    get hpPercent(){
        const percent = this.hp/this.maxHp * 100
        return percent > 0 ? percent : 0
    }

    get xpPercent(){
        const percent = this.xp/this.maxXp * 100
        return percent > 0 ? percent : 0
    }

    get givesXp(){
        return this.level * 5
    }

    startAttack(action:any){
        this.attack?.remove()
        this.attack = document.createElement("div")
        this.attack.classList.add('Attack')
        this.attack.setAttribute('attack-name', action.name)
        if(action.name !== "Headshot") this.attack.setAttribute('team', this.team)
        
        this.activeAttack = document.createElement('img')
        this.attack.appendChild(this.activeAttack)

        this.activeAttack.setAttribute('src', action.src)
        this.activeAttack.setAttribute('alt', action.name)
        document.querySelector(".Battle")!.appendChild(this.attack)
    }

    update(changes: {}){
        Object.keys(changes).forEach(key=>{
            (this as any)[key] = (changes as any)[key];
        })

        

        this.element!.querySelector('.Combatant_level')!.innerHTML = `${this.level}`
        
        this.hpFills?.forEach(rect => rect.setAttribute("width", `${this.hpPercent}%`));
        this.xpFills?.forEach(rect => rect.setAttribute("width", `${this.xpPercent}%`));
    }

    init(container: HTMLElement){
        this.createElement()
        container.appendChild(this.element!)
        // container.appendChild(this.attack!)
        this.update({})
    }
}