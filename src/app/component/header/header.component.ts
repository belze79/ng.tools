import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language, LanguageService } from '../../service/language.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['../../../assets/css/modal.css', './header.component.css']
})
export class HeaderComponent {

  username! : string
    isDark : boolean = false
    isHome! : boolean
    isOpenModal : boolean = false
    language! : Language
    lang! : string
    modals : {[key : string] : boolean} = {}
    isSpinner! : boolean
    subscriptions : Subscription = new Subscription()
  
    constructor(private authService : AuthService,
      private languageService : LanguageService,
      private themeService : ThemeService
    ){}
  
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
        this.modals['lang'] = false
        this.modals['theme'] = false
    }
  
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
  
    openModal(modal : string){
      if(this.modals[modal] === true){
        this.modals[modal] = false
        return
      }
      this.closeModals()
      this.modals[modal] = true
    }
  
    private closeModals(){
      Object.keys(this.modals).forEach(key => {
        if(this.modals[key] === true){
          this.modals[key] = false
        }
      })
    }
  
    stopPropagation(e :Event){
      e.stopPropagation()
    }
  
    setLang(lang : string){
      if(this.lang !== lang){
        this.languageService.lang = lang
        this.languageService.setLang({lang : lang, token : this.authService.accessToken}, lang)
      }
    }
  
    setTheme(isDark : boolean){
      if(this.themeService.theme !== isDark){
        this.themeService.theme = isDark
        this.themeService.setTheme({dark : isDark, token : this.authService.accessToken}, isDark)
      }
    }
  
    logout(){
      this.languageService.online = false
      this.authService.logout()
    }
  
    @HostListener('document:click', ['$event'])
    closeModal(e : MouseEvent){
      const target = e.target as HTMLElement
      if(!target.closest('.btnHead')){
        this.closeModals()
      }
    }

}
