import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerOut } from '../../interface/player_interface';
import { ModalService } from '../../service/modal.service';
import { Subscription } from 'rxjs';
import { Language, LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-ts-siege',
  imports: [CommonModule],
  templateUrl: './ts-siege.component.html',
  styleUrls: ['../../../assets/css/modal.css', './ts-siege.component.css']
})
export class TsSiegeComponent implements OnInit, OnDestroy{

  private static modalID : number = 0
  stringModalID! : string
  @Input() playerOut! : PlayerOut
  isSiege : boolean = false
  ts : number = 0
  tsLvls : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  subscriptions : Subscription = new Subscription()
  language! : Language

  constructor(private modalService : ModalService, private languageService : LanguageService){
    this.stringModalID = `tsSiegeModal-${TsSiegeComponent.modalID++}`
    this.modalService.registerComponent(this.stringModalID)
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
    this.playerOut.isSiege = this.isSiege  
    this.playerOut.ts = this.ts
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  toggleSiege(){
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
    this.isSiege = !this.isSiege
    this.playerOut.isSiege = this.isSiege
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

  tsSelected(ts : number){
    this.ts = ts
    this.playerOut.ts = ts
  }

}
