export class Music {
    audio: HTMLAudioElement;
    isPlaying: boolean;
    element: HTMLElement | null;

    constructor(config: { src: string, volume?: number }) {
        this.audio = new Audio(config.src);
        this.audio.loop = true;
        this.audio.volume = config.volume ?? 0.5;
        this.isPlaying = false;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("button");
        this.element.classList.add("MusicButton");
        this.updateIcon();

        this.element.addEventListener("click", () => {
            this.toggle();
        });
    }

    updateIcon() {
        if (!this.element) return;
        // Ícones simples ou você pode usar classes de CSS para sprites
        this.element.innerText = this.isPlaying ? "🔊" : "🔈";
    }

    toggle() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.audio.play().catch( _ => {
                console.warn("Autoplay bloqueado pelo navegador. Interaja com a página primeiro.");
                this.isPlaying = false;
                this.updateIcon();
            });
        } else {
            this.audio.pause();
        }
        
        this.updateIcon();
    }

    // Método para trocar de música (ex: entrar em batalha)
    changeTrack(newSrc: string) {
        this.audio.pause();
        this.audio.src = newSrc;
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    init(container: HTMLElement) {
        this.createElement();
        container.appendChild(this.element!);
    }
}