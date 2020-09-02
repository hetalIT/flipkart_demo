import { Component } from '@angular/core';
import { DialogService } from './service/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'flipcart-demo-two-six-seven';
  constructor(private dialogService: DialogService){
    if(!localStorage.getItem('currentUser'))
    {
      this.dialogService.openLoginForm();
    }
  }
}
