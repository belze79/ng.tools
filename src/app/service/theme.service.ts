import { Injectable } from '@angular/core';
import { RequestUrl, StorageKey } from '../enum/storage_http_key';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

interface ThemeRequest{
  dark : boolean,
  token : string
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly dbUrl : string = RequestUrl.TEST_DB_URL + '/api/set'
  private isDark : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  isDark$ : Observable<boolean> = this.isDark.asObservable()

  constructor(private http : HttpClient,
    private storageService : StorageService,
    private authService : AuthService
  ) { 
      this.theme = this.theme
  }

  private toggleTheme(isDark : boolean){
    document.body.classList.toggle('dark', isDark)
  }

  get theme() : boolean{
    return this.storageService.theme
  }

  set theme(isDark : boolean){
    if(isDark !== null){
      this.isDark.next(isDark)
      this.storageService.theme = isDark
      this.toggleTheme(isDark)
    }
  }

  setTheme(isDark : boolean){
    const token = this.storageService.accessToken
    if(!token){
      console.log('nessun token da inviare')
      return
    }
    const body : ThemeRequest = {dark : isDark, token : token}
    this.authService.spinner = true
    this.http.post(`${this.dbUrl}/theme`, body).subscribe({
      next : resp => {
        console.log('change theme ok', resp),
        this.theme = isDark
        this.authService.spinner = false
      },
      error : err => {
        this.authService.spinner = false
        console.error('error change theme', err)
      }
    })
  }
}
