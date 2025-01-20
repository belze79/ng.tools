import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  getSession(key : string) : string{
    return sessionStorage.getItem(key) || ''
  }

  setSession(key : string, value : string){
    sessionStorage.setItem(key, value)
  }

  getLocal(key : string) : string{
    return localStorage.getItem(key) || ''
  }

  setLocal(key : string, value : string){
    localStorage.setItem(key, value)
  }
}
