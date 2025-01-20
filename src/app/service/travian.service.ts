import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestUrl } from '../enum/storage_http_key';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

import { GameWorldData, GWMap, Kingdom, Player } from '../interface/gameworld_interface';

interface GameWorldDataResponse{
  response : string,
  success : boolean
}

@Injectable({
  providedIn: 'root'
})
export class TravianService {

  private kingdoms : BehaviorSubject<Kingdom[]> = new BehaviorSubject<Kingdom[]>([])
  private players : BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([])
  kingdoms$ : Observable<Kingdom[]> = this.kingdoms.asObservable()
  players$ : Observable<Player[]> = this.players.asObservable()

  constructor(private http : HttpClient) { }

  getWorlds() : Observable<any>{
    return this.http.get(`${RequestUrl.TEST_DB_URL}/public/travian/worlds`)
  }

  getData(gameWorld : string){
    this.http.post(`${RequestUrl.TEST_DB_URL}/public/travian/data`, {gameworld : gameWorld}).pipe(
      map(resp => {
        const dataString : string = (resp as GameWorldDataResponse).response
        const data = JSON.parse(dataString).response
        const cleanData = this.extractProperty(data)
        this.kingdoms.next(cleanData.kingdoms)
        this.players.next(cleanData.players)
        console.log('caricato')
      }),
      catchError(err => throwError(() => new Error('errore gw data', err)))
    ).subscribe()
  }

  setGameworld(gameWorld : string){
    this.http.post(`${RequestUrl.TEST_DB_URL}/public/travian/setworld`, {gameworld : gameWorld})
    .subscribe({
      next : resp => {
        console.log('set world ok', resp)
      },
      error : err => console.error('errore set world', err)
    })
  }

  private extractProperty(gameworldData : GameWorldData) : GameWorldData{
    const {gameworld, kingdoms, map, players} = gameworldData
    return {
      gameworld : {name : gameworld.name, speedTroops : gameworld.speedTroops},
      kingdoms : kingdoms.map(({kingdomId, kingdomTag, victoryPoints}) => ({
        kingdomId,
        kingdomTag,
        victoryPoints
      })),
      map,
      players : players.map(player => ({
        ...player,
        villages : player.villages.map((villa : any) => ({
          ...villa,
          x : parseInt(villa.x),
          y : parseInt(villa.y)
        }))
      }))
    }
  }
}
