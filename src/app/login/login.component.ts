import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiCallService } from '../service/api-call.service';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from 'rxjs';
import { resolve, reject } from 'q';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
// import { ApiCallMockService } from '../service/api-call-mock.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginSection: boolean= true;
  displayExtraField: boolean= false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  invalidPassword: boolean= false;
  product: any;
  constructor(private dialogRef: MatDialogRef<LoginComponent>, private apiCallService: ApiCallService,
    private authenticationService: AuthenticationService, private router: Router) {

      //================This is just for testing purpose===========================//
      this.apiCallService.getData().subscribe((data: any)=>{
        this.product= data;
      });
      // this.apicallMock.getData().then((data: any)=>{
      //   this.product= data;
      // });
      
        // this.product= this.apiCallService.getData();
      //================This is just for testing purpose (ends)===========================//
     }

  ngOnInit() {
    this.registerForm= new FormGroup({
      'user_mobileNo': new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      'user_password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'user_name': new FormControl(null, [Validators.required]),
      'user_email'   : new FormControl(null, [Validators.required, Validators.email]),
      'user_address' : new FormControl(null, [Validators.required])
    });
    this.loginForm= new FormGroup({
      'user_login': new FormControl(null, [Validators.required, Validators.minLength(10)]),
      'user_password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }
  closeDialog(){
    this.dialogRef.close();
  }

  onClick(){
    if(this.displayExtraField){
      if(this.registerForm.valid)
      {
        let user= this.registerForm.value;
        this.apiCallService.RegisterUser(user).subscribe((res: any)=>{
          if(res._id)
          {
            this.loginSection= true;
            this.registerForm.setValue({
              'user_mobileNo': '',
              'user_password': '',
              'user_name': '',
              'user_email'   : '',
              'user_address' : ''
            });
            alert('Registered successfully');
          }
          else{
            alert('something went wrong try again');
          }
        },(error)=>{
          alert(error.error.text);
        });
        
      }
    }
    else{
      if(this.registerForm.get('user_mobileNo').valid && this.registerForm.get('user_password').valid)
      {
        this.apiCallService.MobileNoExist(this.registerForm.value.user_mobileNo).subscribe((res:any)=>{
          res ? alert('Mobile no already exist') : this.displayExtraField= true;
        });
      }
    }
  }

  onLoginClick(){
    // this.loginSection=false;
    // this.displayExtraField=false;
    if(this.loginForm.valid)
    {
      this.authenticationService.login(this.loginForm.value.user_login, this.loginForm.value.user_password).subscribe(async(res:any)=>{
        if(res.errorMsg)
        {
          alert(res.errorMsg);
          this.loginSection=false;
          this.registerForm.get('user_mobileNo').patchValue(this.loginForm.value.user_login);

        }
        else if(res.token)
        {
          this.invalidPassword= false;
          alert("logged in successfully");
          this.closeDialog();
          localStorage.setItem('currentUser',JSON.stringify({
            "_id" : res._id,
            "mobile" : res.user_mobileNo,
            "token" : res.token
          }));
          if(localStorage.getItem('product'))
          {
            var userCart:any= localStorage.getItem('product');
            await this.apiCallService.updateUserCart(res._id, userCart).subscribe((result: any)=>{
              //console.log(result);console.log(typeof result);
              if(result.user_cart)
              {
                localStorage.removeItem('product');
                // res.user_cart= userCart;
                localStorage.setItem('currentUserCart',result.user_cart);
                this.router.navigate(['/']);
              }
            });
          }
          else
          {
            localStorage.setItem('currentUserCart',res.user_cart);
            this.router.navigate(['/']);
          }
            
        }
        else
        {
          this.invalidPassword= true;
        }
      });
    }
  }
  setValidation(){
      if(isNaN(+this.loginForm.value.user_login))
        this.loginForm.get("user_login").setValidators([Validators.required,Validators.email]);
      else
        this.loginForm.get("user_login").setValidators(
          [Validators.required,Validators.minLength(10), Validators.maxLength(10)]);
    }
}
