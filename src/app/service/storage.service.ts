import { Injectable } from '@angular/core';
import { StorageKey } from '../enum/storage_http_key';

interface Logged{
  logged : boolean
}

interface Theme{
  isDark : boolean
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  getLocal(key : string) : string | null{
    return localStorage.getItem(key)
  }

  setLocal(key : string, value : string){
    localStorage.setItem(key, value)
  }

  get username() : string | null{
    return this.getLocal(StorageKey.USERNAME)
  }

  set username(username : string){
    this.setLocal(StorageKey.USERNAME, username)
  }

  get role() : string | null{
    return this.getLocal(StorageKey.ROLE)
  }

  set role(role : string){
    this.setLocal(StorageKey.ROLE, role)
  }

  get accessToken() : string | null{
    return this.getLocal(StorageKey.ACCESS_TOKEN)
  }

  set accessToken(token : string){
    this.setLocal(StorageKey.ACCESS_TOKEN, token)
  }

  get refreshToken() : string | null{
    return this.getLocal(StorageKey.REFRESH_TOKEN)
  }

  set refreshToken(token : string){
    this.setLocal(StorageKey.REFRESH_TOKEN, token)
  }

  get lang() : string | null{
    return this.getLocal(StorageKey.LANG)
  }

  set lang(lang : string){
    this.setLocal(StorageKey.LANG, lang)
  }

  get theme() : boolean{
    const themeString = this.getLocal(StorageKey.THEME)
    if(themeString){
      return (JSON.parse(themeString) as Theme).isDark
    }
    return false
  }

  set theme(isDark : boolean){
    const theme : Theme = {isDark : isDark}
    this.setLocal(StorageKey.THEME, JSON.stringify(theme))
  }

  get gameworld() : string | null{
    return this.getLocal(StorageKey.GAMEWORLD)
  }

  set gameworld(gameworld : string){
    this.setLocal(StorageKey.GAMEWORLD, gameworld)
  }

  get online() : boolean{
    const loggedString = this.getLocal(StorageKey.LOGIN)
    if(loggedString){
      return (JSON.parse(loggedString) as Logged).logged
    }
    return false
  }

  set online(isLogged : boolean){
    const logged : Logged = {logged : isLogged}
    this.setLocal(StorageKey.LOGIN, JSON.stringify(logged))
  }
}
