import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorResponse } from '../../enum/storage_http_key';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['../../../assets/css/login.css', './register.component.css']
})
export class RegisterComponent implements OnInit{

  form! : FormGroup
  existsUsername : boolean = false
  existsEmail : boolean = false
  invalidEmail : boolean = false
  shortPsw : boolean = false
  isSpinner : boolean = false
  subscriptions : Subscription = new Subscription()

  constructor(private fb : FormBuilder, 
    private authService : AuthService,
    private router :Router){}

  ngOnInit(): void {
      this.form = this.fb.group({
        username : [null, Validators.required],
        email : [null, Validators.required],
        psw : [null, Validators.required]
      })
      this.subscriptions.add(
        this.authService.spinner$.subscribe(spinner => this.isSpinner = spinner)
      )
  }

  submit(){
    if(this.form.valid){
      this.authService.spinner = true
      this.authService.register(this.form.value).subscribe({
        next : resp => {
          console.log('risposta register ok', resp)
          this.authService.spinner = false
          this.router.navigate(['/login'])
        },
        error : err => {
          const message = err.error.response
          this.existsUsername = message === ErrorResponse.EXISTS_USERNAME
          this.existsEmail = message === ErrorResponse.EXISTS_EMAIL
          this.invalidEmail = message === ErrorResponse.INVALID_EMAIL
          this.shortPsw = message === ErrorResponse.SHORT_PSW
          this.authService.spinner = false
          this.router.navigate(['/login'])
          console.error('errore risposta register', err)
        }
      })
    }
  }

}
