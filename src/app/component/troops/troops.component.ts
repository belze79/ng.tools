import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService, TroopImage } from '../../service/image.service';
import { TravianService } from '../../service/travian.service';
import { Subscription } from 'rxjs';
import { PlayerOut } from '../../interface/player_interface';
import { Language, LanguageService } from '../../service/language.service';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-troops',
  imports: [CommonModule],
  templateUrl: './troops.component.html',
  styleUrls: ['../../../assets/css/modal.css', './troops.component.css']
})
export class TroopsComponent implements OnInit, OnDestroy{

  private static modalID : number = 0
  stringModalID! : string
  troopsImage : TroopImage[] = []
  language! : Language
  troopSelected! : {src : string, type : string, trad : string}
  subscriptions : Subscription = new Subscription()
  @Input() playerOut! : PlayerOut

  constructor(private imageService : ImageService, 
    private modalService : ModalService,
    private languageService : LanguageService){
      this.stringModalID = `troopsModal-${TroopsComponent.modalID++}`
      this.modalService.registerComponent(this.stringModalID)
    }

  ngOnInit(): void {
    this.troopsImage = this.imageService.allTroopsImage()
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.modalService.unregisterComponent(this.stringModalID)
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

  setSpeed(troop : TroopImage){
    this.troopSelected = {
      src : troop.src,
      type : troop.type,
      trad : troop.trad
    }
    this.playerOut.speed = troop.speed
    this.playerOut.setted = true
  }

  

}
