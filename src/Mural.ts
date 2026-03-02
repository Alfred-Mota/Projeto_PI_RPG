import { KeyPressListener } from "./KeyPressListener";

export interface LogoItem {
    name: string;
    src: string;
    description: string;
}

interface MuralConfig {
    logos: LogoItem[]; // Recebe a lista de logos do mapa
    onComplete: () => void;
}

export class Mural {
    element: HTMLElement | null = null;
    onComplete: () => void;
    actionListener: KeyPressListener | null = null;
    logos: LogoItem[];

    constructor(config: MuralConfig) {
        this.logos = config.logos;
        this.onComplete = config.onComplete;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Mural_Overlay");

        this.element.innerHTML = `
        <div class="Mural_Container">
            <div class="Mural_Main">
                <div class="Mural_Grid">
                    ${this.logos.map((logo, i) => `
                        <div class="Logo" data-index="${i}" tabindex="0">
                            <img src="${logo.src}" draggable="false" alt="${logo.name}" />
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="Mural_Sidebar">
                <h3 id="Sidebar_Title">Selecione um item</h3>
                <p id="Sidebar_Description">Passe o mouse ou clique para ver os detalhes.</p>
            </div>
        </div>
        `;

        // Eventos para os itens da grade
        const items = this.element.querySelectorAll(".Logo");
        items.forEach(item => {
            const index = Number(item.getAttribute("data-index"));
            const data = this.logos[index];

            // Atualiza ao passar o mouse
            item.addEventListener("mouseenter", () => this.updateSidebar(data));
            
            // Atualiza e foca ao clicar
            item.addEventListener("click", () => {
                this.updateSidebar(data);
                console.log("Selecionado:", data.name);
            });
        });

        this.element.querySelector(".BooksMural_button")?.addEventListener("click", () => this.done());

        this.actionListener = new KeyPressListener({
            keyCode: "Enter",
            callback: () => this.done()
        });
    }

    // Método para atualizar o conteúdo ao lado
    updateSidebar(data: LogoItem) {
        const title = this.element?.querySelector("#Sidebar_Title");
        const description = this.element?.querySelector("#Sidebar_Description");

        if (title && description) {
            title.textContent = data.name;
            description.textContent = data.description;
        }
    }

    done() {
        this.element?.remove();
        this.actionListener?.unbind();
        this.onComplete();
    }

    init(container: HTMLElement) {
        this.createElement();
        container.appendChild(this.element!);
    }
}