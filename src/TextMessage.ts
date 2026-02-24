import { KeyPressListener } from "./KeyPressListener"

interface TextMessageConfig{
    text: string,
    onComplete: ()=> void
}

export class TextMessage{

    text: string
    onComplete: ()=> void
    element: HTMLElement | null = null
    actionListener: KeyPressListener | null = null

    constructor(config: TextMessageConfig){
        this.text = config.text
        this.onComplete = config.onComplete
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("TextMessage")
       
        this.element.innerHTML = `
        <p class="TextMessage_p">${this.text}</p>
        <button class="TextMessage_button">Next</button>
        `
        this.element.querySelector(".TextMessage_button")?.addEventListener("click", ()=>{
            this.done()
        })

        this.actionListener = new KeyPressListener({keyCode:"Enter", callback : ()=>{
            
            this.actionListener?.unbind()
            this.done()
        }})

    }

    done(){
        this.element?.remove()
        this.onComplete()
    }

    init(container: HTMLElement){
        this.createElement()
        container.appendChild(this.element!)
    }
}