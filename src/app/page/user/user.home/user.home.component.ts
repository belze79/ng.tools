import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../../component/header/header.component";
import { TravianService } from '../../../service/travian.service';
import { Kingdom, Player, Village } from '../../../interface/gameworld_interface';

interface WorldNameResponse{
  gameworldName : string,
  online : boolean
}

interface ApiWorldResponse{
  response : WorldNameResponse[]
  success : boolean
}

interface PlayerOut{
  name : string,
  villa : string,
  x : number,
  y : number
}

@Component({
  selector: 'app-user.home',
  imports: [CommonModule, RouterOutlet, HeaderComponent, RouterModule],
  templateUrl: './user.home.component.html',
  styleUrls: ['../../../../assets/css/modal.css', './user.home.component.css']
})
export class UserHomeComponent implements OnInit, OnDestroy{

  isHome! : boolean
  isSpinner! : boolean
  gameWorlds : WorldNameResponse[][] = []
  subscriptions : Subscription = new Subscription()
  kingdoms : Kingdom[] = []
  players : Player[] = []
  playersSelection : Player[] = []
  villageSelection : Village[] = []
  playerOut : PlayerOut | null = null
  kingdomId : string = ''
  kingdomName : string = ''

  @ViewChild('set') set! : ElementRef<HTMLInputElement>

  constructor(private authService : AuthService, private tkService : TravianService, private router : Router){}

  setGameWorld(){
    const value : string = this.set.nativeElement.value
    if(value){
      this.tkService.setGameworld(value)
    }
  }

  getData(name : string){
    if(name){
      this.playersSelection = []
      this.villageSelection = []
      this.tkService.getData(name)
    }
  }

  setPlayersKingdom(kingdomId : string){
    if(kingdomId === 'void'){
      this.playersSelection = this.players
    }
    else this.playersSelection = this.players.filter(player => player.kingdomId === kingdomId)
    this.playersSelection.sort((a, b) => a.name.localeCompare(b.name))
    console.log(this.playersSelection)
  }

  getPlayer(playerID : string){
    const player : Player = this.players.find(pl => pl.playerId === playerID) as Player
    this.villageSelection = player.villages
    this.playerOut = {name : player.name, villa : '', x : 0, y : 0}
    console.log('villages', this.villageSelection)
  }

  getVilla(villa : Village){
    const {name, x, y} : Village = villa 
    this.playerOut = {name : this.playerOut!.name, villa : name, x, y}
    console.log(this.playerOut)
    console.log(villa)
  }

  ngOnInit(): void {
    this.isHome = this.router.url === '/'
    console.log('ishome', this.router.url)
    this.subscriptions.add(
      this.authService.spinner$.subscribe(spinner => this.isSpinner = spinner)
    )
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if(event instanceof NavigationEnd){
          this.isHome = event.url === '/'
        }
      })
    )
    this.subscriptions.add(
      this.tkService.kingdoms$.subscribe(kingdoms => {
        const voidKimgdom : Kingdom = {kingdomId : 'void', kingdomTag : 'Nessun Regno', victoryPoints : ''}
        this.kingdomId = voidKimgdom.kingdomId
        this.kingdomName = voidKimgdom.kingdomTag
        this.kingdoms = [voidKimgdom, ...kingdoms]
      }
    )
    )
    this.subscriptions.add(
      this.tkService.players$.subscribe(players => {
        this.players = players
        this.playersSelection = players
      }
    )
    )
    this.tkService.getWorlds().pipe(
      map((resp : ApiWorldResponse) => {
        const all = resp.response.sort((a, b) => a.gameworldName.localeCompare(b.gameworldName))
        const ini = Array.from(new Set(all.map(gw => gw.gameworldName[0]))).sort()
        ini.forEach(initial => {
          const arr : WorldNameResponse[] = []
          all.forEach(gw => {
            if(initial === gw.gameworldName[0]){
              arr.push(gw)
            }
          })
          arr.sort((a, b) => a.gameworldName.localeCompare(b.gameworldName))
          this.gameWorlds.push(arr)
        })
        console.log('gameworlds', this.gameWorlds)
      }
    ),
      catchError(err => throwError(() => new Error('errore reperimento worlds')))
    ).subscribe()
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe()
  }

  goPhal(){
    this.router.navigate(['/phalangiate'])
  }

  
}
