import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language, LanguageService } from '../../service/language.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { ThemeService } from '../../service/theme.service';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['../../../assets/css/modal.css', './header.component.css']
})
export class HeaderComponent {

  private static modalID : number = 0
  stringModalID! : string
  username! : string
  isDark : boolean = false
  isHome! : boolean
  language! : Language
  lang! : string
  isSpinner! : boolean
  subscriptions : Subscription = new Subscription()

  constructor(private authService : AuthService,
    private languageService : LanguageService,
    private themeService : ThemeService,
    private modalService : ModalService
  ){
    this.stringModalID = `headerModal-${HeaderComponent.modalID++}`
    this.modalService.registerComponent(this.stringModalID)
  }

  ngOnInit(): void {
      this.subscriptions.add(
        this.authService.username$.subscribe(username => this.username = username)
      )
      this.subscriptions.add(
        this.languageService.language$.subscribe(language => this.language = language)
      )
      this.subscriptions.add(
        this.languageService.lang$.subscribe(lang => this.lang = lang)
      )
      this.subscriptions.add(
        this.themeService.isDark$.subscribe(isDark => this.isDark = isDark)
      )
      this.subscriptions.add(
        this.authService.spinner$.subscribe(spinner => this.isSpinner = spinner)
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

  stopPropagation(e :Event){
    e.stopPropagation()
  }

  setLang(lang : string){
    if(this.lang !== lang){
      this.languageService.setLang(lang)
    }
  }

  setTheme(isDark : boolean){
    if(this.themeService.theme !== isDark){
      this.themeService.setTheme(isDark)
    }
  }

  logout(){
    this.languageService.online = false
    this.authService.logout()
  }

}
