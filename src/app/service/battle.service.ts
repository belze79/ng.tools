import { Injectable } from '@angular/core';
import { PlayerOut } from '../interface/player_interface';
import { TravianService } from './travian.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  speedServer! : number

  constructor(private tkService : TravianService) {
    this.tkService.speedTroopServer$.subscribe(speed => this.speedServer = speed)
  }

  distance(pl1 : PlayerOut, pl2 : PlayerOut) : number{
    const x1 = pl1.x!
    const y1 = pl1.y!
    const x2 = pl2.x!
    const y2 = pl2.y!
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  tarvelTime(player : PlayerOut, distance : number) : number{
    if(player.isSiege !== undefined && player.isSiege){
      player.speed = player.speed === 3 ? 3 : 4
    }
    const normalSpedd = this.speedServer * player.speed!
    const tsSpeeed = player.ts! > 0 ? normalSpedd + normalSpedd * player.ts! / 10 : normalSpedd
    let travel;
    if(distance > 20 && player.ts! > 0){
      const difference = distance - 20
      travel = 20 * 3600 / normalSpedd + difference * 3600 / tsSpeeed
    }
    else travel = distance * 3600 / normalSpedd

    return player.isSiege ? Math.floor(travel * 2) : Math.floor(travel)
  }

  stringTime(travelTime : number) : string{
    const h = Math.floor(travelTime / 3600).toString()
    const m = Math.floor(travelTime % 3600 / 60).toString()
    const s = Math.floor(travelTime % 60).toString()
    return `${h.padStart(2, '0')} : ${m.padStart(2, '0')} : ${s.padStart(2, '')}`
  }
}
