interface RevealingTextConfig{
    element: HTMLElement
    text: string
    speed?: number
}

type Span = {
    span: HTMLElement,
    delay: number
}

export class RevealingText{
    element: HTMLElement
    text: string
    speed: number
    timeout: number | null = null
    isDone: boolean = false

    constructor(config: RevealingTextConfig){
        this.element = config.element
        this.text = config.text
        this.speed = config.speed || 70
    }

    revealOneCharacter(characters:Span[]){
        const firts = characters.splice(0,1)[0]
        firts.span.classList.add("reaveled")

        if(characters.length > 0 && !this.isDone){
            this.timeout = setTimeout(()=>{
                this.revealOneCharacter(characters)
            }, firts.delay)
        }else{
            this.isDone = true
        }
    }

    warpToDone(){
        clearTimeout(this.timeout!)
        this.isDone = true
        this.element.querySelectorAll("span").forEach(span=>{
            span.classList.add("reaveled")
        })
    }

    init(){
        const characters:Span[] = []
        this.text.split("").forEach(character => {
            const span = document.createElement("span")
            span.innerHTML = character
            this.element.appendChild(span)

            characters.push({
                span,
                delay: character === " " ? 0:this.speed
            })
        })
        this.revealOneCharacter(characters)
    }
}