import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorResponse } from '../../enum/storage_http_key';
import { LanguageService } from '../../service/language.service';
import { ThemeService } from '../../service/theme.service';

interface LoginResponse{
  response : {
    username : string,
    role : string,
    lang : string,
    dark : boolean,
    accessToken : string,
    refreshToken : string
  },
  success : boolean
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['../../../assets/css/login.css', './login.component.css']
})
export class LoginComponent implements OnInit{

  form! : FormGroup
  errorUsername : boolean = false
  errorPsw : boolean = false
  isSpinner : boolean = false
  subscriptions : Subscription = new Subscription()

  constructor(private fb : FormBuilder, 
    private authService : AuthService,
    private languageService : LanguageService,
    private themeService : ThemeService,
    private router : Router){}

  ngOnInit(): void {
      this.form = this.fb.group({
        username : [null, Validators.required],
        psw : [null, Validators.required]
      })
      this.subscriptions.add(
        this.authService.spinner$.subscribe(spinner => this.isSpinner = spinner)
      )

  }

  submit() : void{
    if(this.form.valid){
      this.authService.spinner = true
      this.authService.login(this.form.value).subscribe({
        next : (loginResponse : LoginResponse) =>{
          if(loginResponse.success){
            this.languageService.online = true
            const {username, role, lang, dark, accessToken, refreshToken} = loginResponse.response
            this.authService.username = username
            this.authService.role = role
            this.languageService.lang = lang
            this.themeService.theme = dark
            this.authService.accessToken = accessToken
            this.authService.refreshToken = refreshToken
            const route : string = role && role === 'USER' ? '' : 'admin'
            this.authService.spinner = false
            this.router.navigate([`/${route}`])
          }
        },
        error : err => {
          console.error('errore risposta login', err)
          const message : string = err.error.response
          this.errorUsername = message === ErrorResponse.INVALID_USERNAME
          this.errorPsw = message === ErrorResponse.INVALID_PSW
          this.authService.spinner = false
        }
      })
    }
  }
}
