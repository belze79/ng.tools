import { Injectable } from '@angular/core';
import { RequestUrl} from '../enum/storage_http_key';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

export interface Language{
  [key : string] : {
    [key : string] : string
  }
}

interface LanguageRequest{
  lang : string,
  token : string
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly dbUrl : string = RequestUrl.TEST_DB_URL + '/api/set'
  private _lang : BehaviorSubject<string> = new BehaviorSubject<string>('it')
  private languageSubject : BehaviorSubject<Language> = new BehaviorSubject<Language>({})
  lang$ : Observable<string> = this._lang.asObservable()
  language$ : Observable<Language> = this.languageSubject.asObservable()

  constructor(private http : HttpClient,
    private storageService : StorageService,
    private authService : AuthService
  ){
      if(this.online){
        this.lang = this.lang
      }
  }

  get online() : boolean{
    return this.storageService.online
  }

  set online(isLogged : boolean){
    this.storageService.online = isLogged
  }

  set language(lang : string){
    this.http.get(`assets/json/${lang}.json`).subscribe({
      next : resp => {
        console.log('json language: ', resp)
        this.languageSubject.next(resp as Language)
      },
      error : err => console.error('error get json language', err)
    })
  }

  get lang() : string{
    return this.storageService.lang || 'it'
  }

  set lang(lang : string){
    if(lang){
      this._lang.next(lang)
      this.storageService.lang = lang
      this.language = lang
    }
  }

  setLang(lang : string){
    const token = this.storageService.accessToken
    if(!token || !lang){
      console.log('nessun token da inviare o nessuna lingua inserita')
      return
    }
    const body : LanguageRequest = {lang : lang, token : token}
    this.authService.spinner = true
    this.http.post(`${this.dbUrl}/lang`, body).subscribe({
      next : resp => {
        console.log('change lang ok', resp),
        this.lang = lang
        this.authService.spinner = false
      },
      error : err => {
        this.authService.spinner = false
        console.error('error change lang', err)
      }
    })
  }
}
