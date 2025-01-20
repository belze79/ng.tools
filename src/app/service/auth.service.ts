import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from 'rxjs';
import { RequestParam, RequestUrl, StorageKey } from '../enum/storage_http_key';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

interface LoginRequest{
  [RequestParam.USERNAME] : string,
  psw : string
}

interface RegisterRequest{
  [RequestParam.USERNAME] : string,
  [RequestParam.EMAIL] : string,
  [RequestParam.PASSWORD] : string
}

interface TokenRequest{
  [RequestParam.TOKEN] : string
}

export interface TokenResponse{
  [RequestParam.ACCESS_TOKEN] : string,
  [RequestParam.REFRESH_TOKEN] : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly publicUrl = RequestUrl.TEST_DB_URL + '/public'
  private readonly authUrl = RequestUrl.TEST_DB_URL + '/api/auth'

  private usernameSubject : BehaviorSubject<string> = new BehaviorSubject<string>('')
  private spinnerSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  username$ : Observable<string> = this.usernameSubject.asObservable()
  spinner$ : Observable<boolean> = this.spinnerSubject.asObservable()
  private roleS! : string
  private accessT! : string
  private refreshT! : string

  constructor(private http : HttpClient, 
    private storageService : StorageService,
    private router : Router) { 
      this.username = this.username
      this.role = this.role
  }

  get username() : string{
    return this.storageService.getLocal(StorageKey.USERNAME)
  }

  set username(username : string){
    this.storageService.setLocal(StorageKey.USERNAME, username)
    this.usernameSubject.next(username)
  }

  get role() : string{
    return this.storageService.getLocal(StorageKey.ROLE)
  }

  set role(role : string){
    this.storageService.setLocal(StorageKey.ROLE, role)
    this.roleS = role
  }

  get accessToken() : string{
    return this.storageService.getLocal(StorageKey.ACCESS_TOKEN)
  }

  set accessToken(token : string){
    this.storageService.setLocal(StorageKey.ACCESS_TOKEN, token)
    this.accessT = token
  }

  get refreshToken() : string{
    return this.storageService.getLocal(StorageKey.REFRESH_TOKEN)
  }

  set refreshToken(token : string){
    this.storageService.setLocal(StorageKey.REFRESH_TOKEN, token)
    this.refreshT = token
  }

  set spinner(isSpinner : boolean){
    this.spinnerSubject.next(isSpinner)
  }

  isValidAuth(role : string) : boolean{
    return this.username !== '' && this.role === role
  }

  login(body : LoginRequest) : Observable<any>{
    return this.http.post(`${this.publicUrl}/login`, body)
  }

  register(body : RegisterRequest) : Observable<any>{
    return this.http.post(`${this.publicUrl}/register`, body)
  }

  cleanStorages(){
    localStorage.removeItem(StorageKey.ACCESS_TOKEN)
    localStorage.removeItem(StorageKey.REFRESH_TOKEN)
    localStorage.removeItem(StorageKey.USERNAME)
    localStorage.removeItem(StorageKey.ROLE)
    localStorage.removeItem(StorageKey.LANG)
    localStorage.removeItem(StorageKey.THEME)
    localStorage.removeItem(StorageKey.LOGIN)
  }

  getNewValidToken(body : TokenRequest) : Observable<any>{
    return this.http.post(`${this.authUrl}/refresh`, body)
  }

  logout(){
    this.spinnerSubject.next(true)
    this.http.post(`${this.authUrl}/logout`, {token : this.accessToken}).pipe(
      map(resp => {
        console.log('risposta logout ok', resp)
      }),
      catchError((error : HttpErrorResponse) => {
        console.error('errore rivevuto da logout', error.status)
        return throwError(() => new Error('errore logout'))
      }),
      finalize(() => {
        this.cleanStorages()
        this.router.navigate(['/login'])
        this.spinnerSubject.next(false)
      })
    ).subscribe()
  }
}
