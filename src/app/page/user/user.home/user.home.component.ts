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
  isGameworld : boolean = false
  gameWorlds : WorldName[][] = []
  subscriptions : Subscription = new Subscription()

  isError : boolean = false
  top : number = -30
  left : number = -300
  mouseX : number = 0
  mouseY : number = 0
  @ViewChild('errorDiv') errorDiv! : ElementRef<HTMLElement>


  constructor(private authService : AuthService, 
    private tkService : TravianService, 
    private storageService : StorageService, 
    private idb : IndexedDbService,
    private router : Router){}

  resetDB() : void{
    this.idb.resetDatabase()
  }

  setErrorDiv() {
    return {
      width : 'max-content',
      backgroundColor : 'blue',
      color : 'red',
      position : 'absolute',
      top : `${this.top}px`,
      left : `${this.left}px`,
      transform : `translate(${this.mouseX}px, ${this.mouseY}px)`,
      transition : 'transform 500ms ease-in-out',
      display : this.isError ? 'block' : 'none'
    }
  }

  showError(e : MouseEvent){
    const target = e.target as HTMLElement
    this.isError = true
    setTimeout(() => {
      
      this.mouseX = this.left > 0 ? -window.innerWidth + e.clientX  : e.clientX + 300
      this.mouseY = this.top > 0 ? -window.innerHeight + e.clientY : e.clientY + 30
      console.log(this.errorDiv.nativeElement.offsetWidth)
    }, 0);
    // this.mouseX = e.clientX
    // this.mouseY = e.clientY
    // console.log(this.mouseX, this.mouseY)
    setTimeout(() => {
      this.isError = false
      this.top = window.innerHeight
      this.left = window.innerWidth
      this.mouseX = 0
      this.mouseY = 0
    }, 2000);
  }

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
}

ngOnDestroy(): void {
  this.subscriptions.unsubscribe()
}

  getData(gameWorld : string){
    if(gameWorld && gameWorld){
      const world = this.gameWorlds.flat().find(obj => obj.name === gameWorld) as WorldName
      this.tkService.getDataFromStore(IndexedDbKey.GAME_WORLD_DATA, gameWorld).subscribe({
        next : () => {
          this.gameWorlds.flat().forEach(obj => obj.status === true ? obj.status = null : obj.status = obj.status)
          world.status = true
          this.storageService.gameworld = gameWorld
          this.isGameworld = true
        },
        error : () => world.status = false
      })
    }
  }

  goPhal(){
    this.router.navigate(['/phalangiate'])
  }

  
}
