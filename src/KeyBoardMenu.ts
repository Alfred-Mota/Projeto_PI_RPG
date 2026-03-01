import { KeyPressListener } from "./KeyPressListener"

export class KeyBoardMenu{
    element: HTMLElement | null = null
    descriptionElement: HTMLElement | null = null
    descriptionElementText: HTMLElement | null = null
    options: Record<string,any>[] = []
    up: any = null
    down: any = null
    prevFocus: HTMLButtonElement|null = null

    setOptions(options:any[]){
        this.options = options
        this.element!.innerHTML= this.options.map((option:any, index)=>{
            return (
                `
                    <div class='option'> 
                
                        <button data-button=${index} data-description="${option.description}">
                            ${option.label}
                        </button>
                        <span class="right">
                            ${option.right ? option.right() : ''}
                            
                        </span>
                    </div>

                `
            )
        }).join("")

        setTimeout(() => {
            const firstButton = this.element?.querySelector("button") as HTMLButtonElement;
            firstButton?.focus();
        }, 10);

        this.element?.querySelectorAll("button").forEach(btn=>{
            btn.addEventListener("click", ()=>{
                const choosenOpt = this.options[Number(btn.dataset.button)]
                choosenOpt.handler()
            })
            btn.addEventListener("mouseenter", ()=>{
                btn.focus()
            })
            btn.addEventListener("focus", ()=>{
                this.prevFocus = btn
                this.descriptionElementText!.innerText = btn.dataset.description as string
            })
        })

    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("KeyboardMenu")

        this.descriptionElement = document.createElement('div')
        this.descriptionElement.classList.add('DescriptionBox')
        this.descriptionElement.innerHTML = ('<p>I will provider description</p>')
        this.descriptionElementText = this.descriptionElement.querySelector('p')

    }

    end(){

        this.element!.remove()
        this.descriptionElement!.remove()

        this.up.unbind()
        this.down.unbind()
    }

    init(container: HTMLElement){
        this.createElement()
        container.appendChild(this.descriptionElement!)
        container.appendChild(this.element!)

        this.up = new KeyPressListener({keyCode:"ArrowUp", callback:()=>{
            const current = Number(this.prevFocus!.getAttribute("data-button"))
            const prevBtn = (Array.from(this.element!.querySelectorAll("button[data-button]")) as HTMLButtonElement[]).reverse().find((btn)=> Number((btn as HTMLButtonElement).dataset.button) < current)
            prevBtn?.focus()

        }})
        this.down = new KeyPressListener({keyCode:"ArrowDown", callback:()=>{
            const current = Number(this.prevFocus!.getAttribute("data-button"))
            const nextBtn = (Array.from(this.element!.querySelectorAll("button[data-button]")) as HTMLButtonElement[]).find((btn)=> Number((btn as HTMLButtonElement).dataset.button) > current)
            nextBtn?.focus()
        }})
    }

}