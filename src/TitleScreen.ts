import { KeyBoardMenu } from "./KeyBoardMenu"

export class TitleScreen{
    element : HTMLElement | null = null
    keyboardMenu: KeyBoardMenu | null = null
    constructor(){

    }
    getOptions(resolve:()=>void){
        return [
            {
                label:"Novo jogo",
                description:"Começar uma nova aventura",
                handler:()=>{
                        this.close()
                        resolve()
                }
            }
        ]
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("TitleScreen")
        this.element.innerHTML = `
        
            <img class="TitleScreen_logo" src="/images/logos_extensoes/ufu.png" alt="UFU"> 
        `
    }
 
    close(){
        this.element!.remove()
        this.keyboardMenu!.end()
    }

    init(container:HTMLElement){
        return new Promise<void>((resolve)=>{
            this.createElement()
            container.appendChild(this.element!)
            this.keyboardMenu = new KeyBoardMenu()
            this.keyboardMenu.init(this.element!)
            this.keyboardMenu.setOptions(this.getOptions(resolve))
        })
    }
}