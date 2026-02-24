interface KeyPressListenerConfig{
    keyCode: string
    callback: ()=>void
}

export class KeyPressListener{
    keyCode: string
    keySafe: boolean = true
    callback: ()=>void
    keydownFunction: (event:any)=>any
    keyupFunction: (event:any)=>any

    constructor(config:KeyPressListenerConfig){
        this.keyCode = config.keyCode
        this.callback = config.callback
        
        this.keydownFunction = (event:any)=>{
 
            if(event.code === this.keyCode){
                if(this.keySafe){
                    this.keySafe = false
                    this.callback()
                }
            }
        }

        this.keyupFunction = (event)=>{
            if(event.code === this.keyCode){
                this.keySafe = true
            }
        }

        document.addEventListener('keydown', this.keydownFunction)
        document.addEventListener('keyup', this.keyupFunction)
        
    }

    unbind(){
        document.removeEventListener('keydown', this.keydownFunction)
        document.removeEventListener('keyup', this.keyupFunction)

    }
}