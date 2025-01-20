export interface GameWorldData{
    gameworld : GameWorld,
    kingdoms : Kingdom[],
    map : GWMap,
    players : Player[]
}

export interface GameWorld{
    name : string,
    speedTroops : number
}

export interface Kingdom{
    kingdomId : string
    kingdomTag : string
    victoryPoints : string
}

export interface GWMap{
    cells : any[],
    landscapes : any
}

export interface Player{
    externalLoginToken : string,
    kingdomId : string,
    name : string,
    playerId : string,
    role : number,
    treasures : number,
    tribeId : string
    villages : Village[]
}

export interface Village{
    isCity: boolean,
    isMainVillage : boolean,
    name : string,
    population : string,
    villageId : string,
    x : number,
    y : number
}

