
export class SceneTransition{
    element: HTMLElement | null = null

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("SceneTransition")

    }

    fadeOut(){
        this.element?.classList.add("fade-out")
        this.element?.addEventListener("animationend", ()=>{
            this.element?.remove()
            this.element = null
        }, {once:true})
    }

    init(container: HTMLElement, callback:()=>void){
        this.createElement()
        console.log("aqui")
        container.appendChild(this.element!)

        this.element?.addEventListener("animationend", ()=>{
            callback()
            this.fadeOut()
        }, {once:true})
    }
}