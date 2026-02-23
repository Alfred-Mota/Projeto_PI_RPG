import { Overworld } from "./Overworld";

const overworld = new Overworld({element: document.querySelector(".game-container") as HTMLElement})

overworld.init()