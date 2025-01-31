import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalService } from './service/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  constructor(private modalService : ModalService){}

  @HostListener('document:click', ['$event'])
  onDocumentClick(e : MouseEvent){
    const target = e.target as HTMLElement
    if(target.closest('.btnModal')) return
    this.modalService.closeAllModals()
  }
}
