import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayeroutComponent } from "../../../component/playerout/playerout.component";
import { TroopsComponent } from "../../../component/troops/troops.component";
import { PlayerOut } from '../../../interface/player_interface';
import { BattleService } from '../../../service/battle.service';
import { TsSiegeComponent } from "../../../component/ts-siege/ts-siege.component";
import { DateTimeComponent } from "../../../component/date-time/date-time.component";
import { Language, LanguageService } from '../../../service/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user.phalangiate',
  imports: [RouterModule, CommonModule, PlayeroutComponent, TroopsComponent, TsSiegeComponent, DateTimeComponent],
  templateUrl: './user.phalangiate.component.html',
  styleUrl: './user.phalangiate.component.css'
})
export class UserPhalangiateComponent implements OnInit, OnDestroy{

  subscriptions : Subscription = new Subscription()
  language! : Language
  attacker : PlayerOut = {setted : false, tribe : 0, isSiege : false}
  defender : PlayerOut = {setted : false}
  phalanger : PlayerOut = {setted : false, tribe : 0}
  arrival! : Date

  constructor(private battleService : BattleService, private languageService : LanguageService){}

  ngOnInit(): void {
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  logPlayer(){
    console.log(this.attacker)
  }

  calcola(){
    const distance = this.battleService.distance(this.attacker, this.defender)
    console.log('distanza attacke defender', distance.toFixed(3))
    const travel = this.battleService.tarvelTime(this.attacker, distance)
    console.log(this.battleService.stringTime(travel))
    const arrival = new Date('2025/1/1 00:00:00')
    const start = new Date(arrival.getTime() - travel * 1000)
    console.log(start.toLocaleString())

  }

  control() : boolean{
    return this.attacker.setted && this.phalanger.setted && this.defender.villa !== undefined
  }

  
}

