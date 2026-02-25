import { KeyPressListener } from "./KeyPressListener"
import { RevealingText } from "./RevealingText"

interface TextMessageConfig{
    text: string,
    onComplete: ()=> void
}

export class TextMessage{

    text: string
    onComplete: ()=> void
    element: HTMLElement | null = null
    actionListener: KeyPressListener | null = null
    revealingText: RevealingText | null = null
    constructor(config: TextMessageConfig){
        this.text = config.text
        this.onComplete = config.onComplete
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("TextMessage")
       
        this.element.innerHTML = `
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button">Next</button>
        `
        const p = this.element.querySelector(".TextMessage_p") as HTMLElement
        this.revealingText = new RevealingText({element: p, text: this.text})

        this.element.querySelector(".TextMessage_button")?.addEventListener("click", ()=>{
            this.done()
        })

        this.actionListener = new KeyPressListener({keyCode:"Enter", callback : ()=>{
            
            this.done()
            
        }})

    }

    done(){
       if(this.revealingText?.isDone){
        this.element?.remove()
        this.actionListener?.unbind()
        this.onComplete()
       }else{
        this.revealingText?.warpToDone()
       }
    }

    init(container: HTMLElement){
        this.createElement()
        container.appendChild(this.element!)
        this.revealingText!.init()
    }
}