import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../service/modal.service';
import { CapitalizePipe } from '../../pipe/capitalize.pipe';
import { Padstart2Pipe } from '../../pipe/padstart2.pipe';
import { Subscription } from 'rxjs';
import { Language, LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-date-time',
  imports: [CommonModule, CapitalizePipe, Padstart2Pipe],
  templateUrl: './date-time.component.html',
  styleUrls: ['../../../assets/css/modal.css', './date-time.component.css']
})
export class DateTimeComponent implements OnInit, OnDestroy{

  private static modalID : number = 0
  stringModalID! : string
  date : Date = new Date()
  @Output() arrival : EventEmitter<Date> = new EventEmitter<Date>()
  subscriptions : Subscription = new Subscription()
  language! : Language
  lang! : string
  years : number[] = []
  mounthNames : string[] = []
  daysOfMonth : number[] = []
  hours : number[] = [...Array(24)].map((_, i) => i)
  minutes : number[] = [...Array(60)].map((_, i) => i)
  year! : number
  monthName! : string
  day! : number
  hour! : number
  minute! : number
  second! : number

  constructor(private modalService : ModalService, private languageService : LanguageService){
    this.stringModalID = `datetimeModal-${DateTimeComponent.modalID++}`
    this.modalService.registerComponent(this.stringModalID)
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.languageService.lang$.subscribe(lang => {
        this.lang = lang
        this.setMonthNames(this.date)
      })
    )
    this.subscriptions.add(
      this.languageService.language$.subscribe(language => this.language = language)
    )
    this.date.setSeconds(this.date.getSeconds() + 1, 0)
    this.years = [...Array(21)].map((_, i) => 2015 + i)
    this.setDaysOfMonth(this.date)
    this.year = this.date.getFullYear()
    this.day = this.date.getDate()
    this.hour = this.date.getHours()
    this.minute = this.date.getMinutes()
    this.second = this.date.getSeconds()
    this.arrival.emit(this.date)
  }

  ngOnDestroy(): void {
    this.modalService.unregisterComponent(this.stringModalID)
    this.subscriptions.unsubscribe()
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

  setYear(year : number){
    this.date.setFullYear(year)
    this.year = year
    this.arrival.emit(this.date)
  }

  setMonth(index : number){
    let currentDay = this.date.getDate()
    const lastOfMonth = new Date(this.date.getFullYear(), index + 1, 0).getDate()
    if(currentDay > lastOfMonth){
      currentDay = lastOfMonth
      this.day = lastOfMonth
    }
    this.date.setMonth(index, currentDay)
    this.monthName = this.date.toLocaleDateString(this.setLang(), {month : 'long'})
    this.setDaysOfMonth(this.date)
    this.arrival.emit(this.date)
  }

  setDay(day : number){
    this.date.setDate(day)
    this.day = day
    this.arrival.emit(this.date)
  }

  setHour(hour : number){
    this.date.setHours(hour)
    this.hour = hour
    this.arrival.emit(this.date)
  }

  setMinute(minute : number){
    this,this.date.setMinutes(minute)
    this.minute = minute
    this.arrival.emit(this.date)
  }

  setSecond(second : number){
    this.date.setSeconds(second)
    this.second = second
    this.arrival.emit(this.date)
  }

  formatDate() : string{
    const dateFormat = this.date.toLocaleDateString(this.setLang(), {
      day : '2-digit',
      month : 'short',
      weekday : 'short',
      year : 'numeric'
    }).replaceAll(',', '')
    const timeFormat = this.date.toLocaleTimeString(this.setLang(), {timeStyle : 'medium'}).replaceAll(',', '')
    return  `${dateFormat} <> ${timeFormat}`
  }

  setMonthNames(date : Date){
    const newDate = new Date(date)
    newDate.setMonth(0, 1)
    let count = 0
    this.mounthNames = []
    while(count < 12){
      newDate.setMonth(count++)
      const monthName = newDate.toLocaleDateString(this.setLang(), {month : 'long'})
      this.mounthNames.push(monthName)
    }
    this.monthName = this.date.toLocaleDateString(this.setLang(), {month : 'long'})
  }

  private setDaysOfMonth(date : Date){
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    this.daysOfMonth = [...Array(lastDay)].map((_, i) => i + 1)
  }

  private setLang() : string{
    return `${this.lang.toLowerCase()}-${this.lang.toUpperCase()}`
  }

}
