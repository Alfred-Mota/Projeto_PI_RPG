import { KeyPressListener } from "./KeyPressListener";

interface BooksMuralConfig{
    text?: string
    onComplete: ()=>void
}

export class BooksMural{
    text:string | null
    element: HTMLElement | null = null
    onComplete: ()=>void
    actionListener: KeyPressListener | null = null
    bookImages: string[] = [
        "/images/characters/Book_2.png",
        "/images/characters/Book_3.png"
    ];

    constructor(config:BooksMuralConfig){
        this.text = config.text || null
        this.onComplete = config.onComplete
 
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("BooksMural_Overlay");
        
        // Criamos o HTML da grade (4 colunas x 3 linhas = 12 espaços)
        this.element.innerHTML = `
        <div class="BooksMural">
            <div class="BooksMural_Grid">
                    ${Array(9).fill(0).map((_, i) => {
                        // Alterna entre as duas imagens que você tem
                        const imgSrc = this.bookImages[i % this.bookImages.length];
                        return `
                            <div class="Book" data-book="${i}">
                                <img src="${imgSrc}" draggable="false" />
                            </div>
                        `;
                    }).join("")}
                </div>
                <button class="BooksMural_button">Next</button>
            </div>
        `;

       
        this.element.querySelectorAll(".Book").forEach(slot => {
            slot.addEventListener("click", () => {
                console.log("Clicou no livro:", slot.getAttribute("data-book"));
            });
        });

        this.element.querySelector(".BooksMural_button")?.addEventListener("click", ()=>{
            this.done()
        })

       this.actionListener = new KeyPressListener({keyCode:"Enter", callback : ()=>{
                   
            this.done()
            this.actionListener?.unbind()
        }})
    }

    done(){
        this.element?.remove()
        this.onComplete()
    }

    init(container:HTMLElement){
        this.createElement()
        container.appendChild(this.element!)
    }


}