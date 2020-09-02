import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  orderSuccessful:boolean=false;
  constructor() { }
  showAlert(msg: string){
    this.orderSuccessful=true;
    // this.alert(msg);
  }
}
