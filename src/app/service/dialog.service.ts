import { Injectable } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
  openConfirmDialog(msg: string){
    return this.dialog.open(MatConfirmDialogComponent,{
      width: '410px',
      disableClose: true,
      panelClass: 'confirm-dialog-container',
      data:{
        message: msg
      }
    });
  }

  openLoginForm(){
    this.dialog.open(LoginComponent, {
      width: '600px',
      panelClass: 'login-form-container',
      disableClose: true,
      position: { top: "40px" }
    });
  }
}
