import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Modals{
  [id : string] : {[modal : string] : boolean}
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modals : Modals = {}

  registerComponent(modalID : string){
    if(!this.modals[modalID]){
      this.modals[modalID] = {}
    }
  }

  unregisterComponent(modalID : string){
    delete this.modals[modalID]
  }

  toggleModal(modalID : string, modalKey : string){
    const currentStatus = this.modals[modalID][modalKey]
    this.closeAllModals()
    this.modals[modalID][modalKey] = !currentStatus
  }


  closeAllModals(){
    Object.keys(this.modals).forEach(modalID => 
      Object.keys(this.modals[modalID]).forEach(modalKey => 
        this.modals[modalID][modalKey] = false
      )
    )
  }

  isOpenModal(modalID : string, modalKey : string) : boolean{
    return this.modals[modalID] ? this.modals[modalID][modalKey] : false
  }

}
