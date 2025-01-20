import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin.home',
  imports: [CommonModule],
  templateUrl: './admin.home.component.html',
  styleUrl: './admin.home.component.css'
})
export class AdminHomeComponent implements OnInit, OnDestroy{

  username! : string
  isSpinner! : boolean
  subscriptions : Subscription = new Subscription()

  constructor(private authService : AuthService){}

  ngOnInit(): void {
      this.subscriptions.add(
        this.authService.username$.subscribe(username => this.username = username)
      )
      this.subscriptions.add(
        this.authService.spinner$.subscribe(spinner => this.isSpinner = spinner)
      )
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe()
  }

  logout(){
    this.authService.logout()
  }
}
