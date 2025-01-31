import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Kingdom, Player, Village } from '../../interface/gameworld_interface';
import { TravianService } from '../../service/travian.service';
import { PlayerOut } from '../../interface/player_interface';
import { IndexedDbService } from '../../service/indexed-db.service';
import { ModalService } from '../../service/modal.service';
import { Language, LanguageService } from '../../service/language.service';


@Component({
  selector: 'app-playerout',
  imports: [CommonModule],
  templateUrl: './playerout.component.html',
  styleUrls: ['../../../assets/css/modal.css', './playerout.component.css']
})
export class PlayeroutComponent implements OnInit, OnDestroy{

  subscriptions : Subscription = new Subscription()
  language! : Language
  kingdoms : Kingdom[] = []
  players : Player[] = []
  playersInKingdom : Player[] = []
  villagesOfPlayer : Village[] = []
  kingdomId : string = ''
  kingdomName : string = ''
  playerName : string = ''
  villageName : string = ''
  private static modalID : number = 1
  stringModalID! : string
  @Input() playerOut! : PlayerOut
  

  constructor(private tkService : TravianService, 
    private languageService : LanguageService,
    private modalService : ModalService
  ){

    this.stringModalID = `playerOutModals-${PlayeroutComponent.modalID++}`
    this.modalService.registerComponent(this.stringModalID)
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.tkService.kingdoms$.subscribe(kingdoms => {
        const voidKimgdom : Kingdom = {kingdomId : 'void', kingdomTag : '----------', victoryPoints : ''}
        this.kingdomId = voidKimgdom.kingdomId
        this.kingdomName = voidKimgdom.kingdomTag
        this.kingdoms = [voidKimgdom, ...kingdoms]
      })
    )
    this.subscriptions.add(
      this.tkService.players$.subscribe(players => {
        this.players = players.sort((a, b) => a.name.localeCompare(b.name))
        this.playersInKingdom = players
        this.playerName = '----------'
        this.villageName = '----------'
      })
    )
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
  }

  ngOnDestroy(): void {
    console.log('playerout destroy')
    this.subscriptions.unsubscribe()
    this.modalService.unregisterComponent(this.stringModalID)
  }

  setPlayersInKingdom(kingdomId : string, kingdomTag : string){
    if(kingdomId === 'void'){
      this.playersInKingdom = this.players
    }
    else this.playersInKingdom = this.players.filter(player => player.kingdomId === kingdomId)
    this.kingdomName = kingdomTag
    this.playerName = '----------'
    this.villagesOfPlayer = []
    this.villageName = '----------'
    this.unsetProperty(this.playerOut)
  }

  setPlayer(playerID : string){
    const player : Player = this.players.find(pl => pl.playerId === playerID) as Player
    this.villagesOfPlayer = player.villages
    this.playerName = player.name
    this.villageName = '----------'
    this.unsetProperty(this.playerOut)
    this.playerOut.tribe = parseInt(player.tribeId)
  }

  setVillage(village : Village){
    this.villageName = village.name
    this.playerOut.nick = this.playerName
    this.playerOut.villa = village.name
    this.playerOut.x = village.x
    this.playerOut.y = village.y
  }

  private unsetProperty(playerOut : PlayerOut){
    playerOut.setted = false
    playerOut.nick = undefined
    playerOut.villa = undefined
    playerOut.x = undefined
    playerOut.y = undefined
    playerOut.speed = undefined
    playerOut.tribe = 0
  }

  toggleModal(modalKey : string){
    this.modalService.toggleModal(this.stringModalID, modalKey)
  }

  isOpenModal(modalKey : string) : boolean{
    return this.modalService.isOpenModal(this.stringModalID, modalKey)
  }

  stopPropagation(e : Event){
    e.stopPropagation()
  }


}
