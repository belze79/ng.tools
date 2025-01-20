import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, TokenResponse } from '../service/auth.service';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

let isRequestRun : boolean = false
let isRefersh : boolean = false
let clone : HttpRequest<unknown>

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  if(['assets', 'public'].some(word => req.url.includes(word))){
    return next(req)
  }

  const token : string = isRefersh ? authService.refreshToken : authService.accessToken
  console.log(isRefersh ? 'refreshToken' : 'accessToken', 'in interceptor', token)

  clone = req.clone({
    setHeaders : {Authorization: `Bearer ${token}`}
  })

  return next(clone).pipe(
    catchError((error : HttpErrorResponse) => {
      if(error.status === 401 || error.status === 403){
        console.log('errore intercettato: ', error.status)
        return handleAuthErrors(clone, next, authService, router)
      }
      console.log('dio porco error: ', error.status)
      return throwError(() => console.error('errore diverso da 401 o 403', error))
    })
  )
}

const handleAuthErrors = (req : HttpRequest<unknown>, next : HttpHandlerFn, authService : AuthService, router : Router) => {
  console.log('dentro handle errors')

  if(isRequestRun){
    console.log('richiesta in corso')
    return next(req)
  }

  isRequestRun = true
  isRefersh = true

  if(!authService.refreshToken){
    authService.cleanStorages()
    router.navigate(['/login'])
    return throwError(() => new Error('refresh token non reperito'))
  }

  return authService.getNewValidToken({token : authService.refreshToken}).pipe(
    switchMap((tokens : {response : TokenResponse, success : boolean}) => {
      console.log('risposta tokens: ', tokens)
      authService.accessToken = tokens.response.accessToken
      authService.refreshToken = tokens.response.refreshToken
      clone = req.clone({
        setHeaders : {Authorization: `Bearer ${tokens.response.accessToken}`},
        body : req.body ? {...req.body, token : tokens.response.accessToken} : null
      })
      console.log('nuova richiesta dopo il refresh', clone)
      return next(clone)
    }),
    catchError((error : HttpErrorResponse) => {
      console.log('errore intercettato nel catcherror', error.status)
      if([401, 403].includes(error.status)){
        authService.logout()
        return throwError(() => new Error('refresh token compromesso o mancante: ' + error.error))
      }
      return throwError(() => new Error(`errore generico server ${error.status}`))
    }),
    finalize(() => {
      isRefersh = false
      isRequestRun = false
    })
  )
}
