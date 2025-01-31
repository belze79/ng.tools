import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../../component/header/header.component";
import { TravianService, WorldName } from '../../../service/travian.service';
import { PlayerOut } from '../../../interface/player_interface';
import { StorageService } from '../../../service/storage.service';
import { IndexedDbService } from '../../../service/indexed-db.service';
import { IndexedDbKey } from '../../../enum/storage_http_key';
import { PlayeroutComponent } from "../../../component/playerout/playerout.component";


@Component({
  selector: 'app-user.home',
  imports: [CommonModule, RouterOutlet, HeaderComponent, RouterModule],
  templateUrl: './user.home.component.html',
  styleUrls: ['../../../../assets/css/modal.css', './user.home.component.css']
})
export class UserHomeComponent implements OnInit, OnDestroy{

  isHome! : boolean
  isSpinner! : boolean
  isError! : boolean
  isGameworld : boolean = false
  gameWorlds : WorldName[][] = []
  subscriptions : Subscription = new Subscription()
  top : number = 0
  left : number = 0
  errorMessage! : string
  inactiveWorlds! : string[]


  constructor(private authService : AuthService, 
    private tkService : TravianService, 
    private storageService : StorageService, 
    private idb : IndexedDbService,
    private router : Router){}


  ngOnInit(): void {
    this.isHome = this.router.url === '/'
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
    this.tkService.getWorlds().subscribe({
      next : resp => {
          this.gameWorlds = resp
          console.log('gameworlds', this.gameWorlds)
          const gameworld = this.storageService.gameworld
          if(gameworld){
            this.getData(gameworld)
          }
      },
      error : err => {
        console.error('errore richiesta nomi mondi', err)
      }
    })
    this.inactiveWorlds = this.storageService.inactiveWorlds
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  isInactiveWorld(gameworld : string) : boolean{
    return this.inactiveWorlds.includes(gameworld)
  }

  setErrorMessage(gameworld : string){
    this.errorMessage = `mondo di gioco ${gameworld} non attivo`
    this.isError = true
    setTimeout(() => {
      this.isError = false
    }, 3000);
  }

  getData(gameWorld : string, e : MouseEvent | null = null){
    if(gameWorld){
      if(e){
        this.top = e.pageY
        this.left = e.pageX
      }
      if(this.isInactiveWorld(gameWorld)){
        this.setErrorMessage(gameWorld)
        return
      }
      this.isSpinner = true
      const world = this.gameWorlds.flat().find(obj => obj.name === gameWorld) as WorldName
      this.tkService.getDataFromStore(IndexedDbKey.GAME_WORLD_DATA, gameWorld).subscribe({
        next : () => {
          this.gameWorlds.flat().forEach(obj => obj.status === true ? obj.status = null : obj.status = obj.status)
          world.status = true
          this.storageService.gameworld = gameWorld
          this.isGameworld = true
          this.isSpinner = false
        },
        error : () => {
          world.status = false
          this.isSpinner = false
          this.inactiveWorlds.push(gameWorld)
          this.storageService.inactiveWorlds = this.inactiveWorlds
          this.setErrorMessage(gameWorld)
        },
        complete : () => this.isSpinner = false
      })
    }
  }

  goPhal(){
    this.router.navigate(['/phalangiate'])
  }

  
}
