import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestUrl } from '../enum/storage_http_key';
import { BehaviorSubject, catchError, filter, from, isEmpty, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { GameWorldData, GWMap, Kingdom, Player } from '../interface/gameworld_interface';
import { IndexedDbService } from './indexed-db.service';

interface GameWorldDataResponse{
  response : string,
  success : boolean
}

interface WordsResponse{
  response : string[],
  success : boolean
}

export interface WorldName{
  name : string,
  status : boolean | null
}

interface IndexedDbApi{
  key : string,
  date : Date
  value : GameWorldData
}

@Injectable({
  providedIn: 'root'
})
export class TravianService {

  private kingdoms : BehaviorSubject<Kingdom[]> = new BehaviorSubject<Kingdom[]>([])
  private players : BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([])
  private speedTroopsServer : BehaviorSubject<number> = new BehaviorSubject<number>(1)
  kingdoms$ : Observable<Kingdom[]> = this.kingdoms.asObservable()
  players$ : Observable<Player[]> = this.players.asObservable()
  speedTroopServer$ : Observable<number> = this.speedTroopsServer.asObservable()

  constructor(private http : HttpClient, private idb : IndexedDbService) { }

  getWorlds() : Observable<WorldName[][]>{
    return this.http.get<WordsResponse>(`${RequestUrl.TEST_DB_URL}/public/travian/worlds`).pipe(
      map(resp => {
        const filtrato = resp.response.filter(word => word !== 'treat' && word !== 'trick')

        const groups = filtrato.reduce<{[key : string] : WorldName[]}>((group, word) => {
          const prefix = word.slice(0, 2)
          group[prefix] = group[prefix] || []
          group[prefix].push({name : word, status : null})
          return group
        }, {})

        return [...Object.values(groups), [{name : 'treat', status : null}, {name : 'trick', status : null}]]
      })
    )
  }

  getDataFromStore<T>(storeName : string, gameWorld : string) : Observable<T | undefined>{
    this.idb.deleteOldData(storeName)
    return this.idb.getData<IndexedDbApi | undefined>(storeName, gameWorld).pipe(
      switchMap((data) => {
        if(data){
          console.log('dati presenti in indexedDB', data.value)
          this.setFromaData(data.value)
          return of(data.value as T)
        }
        else return this.getData(gameWorld).pipe(
          switchMap(httpData => {
            console.log('dati da richiesta http', httpData)
            this.setFromaData(httpData)
            return this.idb.addData(storeName, {key : gameWorld, date : new Date(), value : httpData}).pipe(
              map(() => httpData as T),
              catchError(() => throwError(() => new Error('errore aggiunta dati indexedDB')))
            )
          }),
          catchError(() => throwError(() => new Error('errore richiesta dati http')))
        )
      }),
      catchError(() => throwError(() => new Error('Errore get data da indexedDB')))
    )
  }

  getData(gameWorld : string) : Observable<GameWorldData>{
    return this.http.post(`${RequestUrl.TEST_DB_URL}/public/travian/getworld`, {gameworld : gameWorld}).pipe(
      switchMap(resp => {
        const dataString : string = (resp as GameWorldDataResponse).response
        const data = JSON.parse(dataString).response
        console.log('data http response', data)
        if(Array.isArray(data) && data.length === 0){
          console.log('risposta ok ma senza dati', data)
        }
        console.log('data ultimo aggiornamento\n', new Date(data.gameworld.lastUpdateTime * 1000))
        // console.log('data in oggetto response\n', new Date())
        const cleanData = this.extractProperty(data)
        this.setFromaData(cleanData)
        console.log('caricato con velocità truppe: ', this.players.value)
        return of(cleanData)
      }),
      catchError((err : HttpErrorResponse) => {
        if(err.status === 404){
          console.log('mondo di gioco non attivo')
        }
        return throwError(() => new Error('errore server'))
      }
    )
    )
  }

  setFromaData(data : GameWorldData){
    this.speedTroopsServer.next(data.gameworld.speedTroops)
    this.kingdoms.next(data.kingdoms)
    this.players.next(data.players)
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
