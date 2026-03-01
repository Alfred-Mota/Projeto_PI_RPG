export const ATTACKS = {
    "strike": {
        name: "Hydraulic-Strike",
        src: "/images/attacks/robo.png",
        succes:[
            {type:"textMessage", text:"{CASTER} usou Hydraulic Strike"},
            {type:"animation", animationFn:"roboPunch"},
            {type:"changeState", damage:8}
       ]
    },
    "discharge": {
        name: "Thermal-Discharge",
        src: "/images/attacks/robo.png",
        succes:[
            {type:"textMessage", text:"{CASTER} usou Thermal Discharge"},
            // {type:"animation", animationFn:"roboThermal"},
            // {type:"changeState", damage:15}
        ]
    },
    "headshot": {
        name: "Headshot",
        src: "/images/attacks/book.png",
        succes:[
            {type:"textMessage", text:"{CASTER} usou Headshot"},
            {type:"animation", animationFn:"book"},
            {type:"changeState", damage:5}
       ]
    },
    "highGain": {
        name: "High-Gain-Ray",
        src: "/images/attacks/directional.png",
        succes:[
            {type:"textMessage", text:"{CASTER} usou High Gain Ray"},
            {type:"animation", animationFn:"highGain"},
            {type:"changeState", damage:12}
       ]
    },
    "omniBurst": {
        name: "Omni-Burst",
        src: "/images/attacks/omn.png",
        succes:[
            {type:"textMessage", text:"{CASTER} usou Omni Burst"},
            // {type:"animation", animationFn:"antOmn"},
            // {type:"changeState", damage:15}
       ]
    },
} as const;

export const ITEMS = {
    "poison": {
        name: "Poison-Recover",
        src: "/images/attacks/poison.png",
        succes:[
            {type:"textMessage", text:"{CASTER} usou Recover"},
            // {type:"animation", animationFn:"antOmn"},
            // {type:"changeState", damage:15}
       ]
    }
} as const;