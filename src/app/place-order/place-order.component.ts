import {Component, OnInit, OnDestroy, AfterViewChecked, Input} from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { ApiCallService } from '../service/api-call.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';
import {AlertService} from "../service/alert.service";

declare let paypal: any;
@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit, OnDestroy, AfterViewChecked {
  isUserLoggedIn: boolean = false;
  userMobile: string;
  loginForm: FormGroup;
  continueClicked: boolean = false;
  continueOrderClicked: boolean = false;
  invalidPassword: boolean = false;
  addScript: boolean = false;
  navigationSubscription: Subscription;
  addressType: string = "Home";
  addressForm: FormGroup;
  showOrderSummary: boolean = false;
  userId: string;
  @Input() price: number;
  states: string[] = ["Assam", "Bihar", "Gujarat", "Himachal Pradesh", "Kerala", "Punjab", "Assam", "Bihar", "Gujarat", "Himachal Pradesh", "Kerala", "Punjab", "Assam", "Bihar", "Gujarat", "Himachal Pradesh", "Kerala", "Punjab", "Assam", "Bihar", "Gujarat", "Himachal Pradesh", "Kerala", "Punjab"];
  constructor(private authenticationService: AuthenticationService, private apiCallService: ApiCallService,
    private router: Router, private alertService: AlertService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'dvnfgo_ghdnfrthigtu8turiewertgnfdvnfgo_ghdnfrthigtu8turiewertgnfdvnfgo_ghdnfrthigtu8turiewertgnf'
    },
    commit: true,
    style: {
      size: 'small',
      // color: 'blue',
      shape: 'pill',
      label: 'checkout',
      tagline: 'true'
     },
    payment: (data, actions) => {
      var order={
        "products": localStorage.getItem('currentUserCart'),
        "amount" : this.price
      };
      this.apiCallService.storeOrder(order, this.userId).subscribe((res:any)=>{
        if(res.nModified===1){
          console.log("testing");
          localStorage.setItem('currentUserCart','[]');
          this.alertService.showAlert("Payment and Order Completed Successfully");
          localStorage.removeItem("showPlaceorder");
          this.router.navigate(['/viewcart']);
        }
      });
      return actions.payment.create({
        payment: {
          transactions: [
            {
              amount: {
                total: this.price,
                currency: 'USD'
              }
            }
          ]
        },
      });
    },
        onAuthorize: (data, actions) => {
          return actions.payment.execute().then((payment: any) => {
            window.alert('Thank you for your purchase!');
          });
        }


  };

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.isUserLoggedIn = true;
      this.userMobile = JSON.parse(localStorage.getItem('currentUser')).mobile;
      this.userId = JSON.parse(localStorage.getItem('currentUser'))._id;
    }
    this.loginForm = new FormGroup({
      "user_login": new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      'user_password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    this.addressForm = new FormGroup({
      'addr_name': new FormControl(null, [Validators.required]),
      'delivery_mobile_no': new FormControl(null, [Validators.required, Validators.minLength(10),
      Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'pincode': new FormControl(null, [Validators.required, Validators.min(111111)]),
      'locality': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'city': new FormControl(null, [Validators.required]),
      'state': new FormControl(null, [Validators.required]),
      'landmark': new FormControl(null),
      'alternate_mobile_no': new FormControl(null, [Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'addr_type': new FormControl(null, [Validators.required])
    });
    this.apiCallService.getDeliveryAddress(this.userId).subscribe((res: any) => {
      if (res.user_delivery_address) {
        this.addressForm.setValue(res.user_delivery_address);
        this.showOrderSummary = true;
      }
    });
    // this.addressForm.setValue({
    //   addr_name: "Surat",
    //   addr_type: "Work",
    //   address: "delhi",
    //   alternate_mobile_no: "8888888888",
    //   city: "surat",
    //   delivery_mobile_no: "2222222222",
    //   landmark: "garden",
    //   locality: "adajan",
    //   pincode: 398801,
    //   state: "Assam"
    // });
  }
  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
  ngAfterViewChecked() {

    // paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
  }
  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve,reject)=>{
      let scriptElement=document.createElement('script');
      scriptElement.src="https://www.paypalobjects.com/api/checkout.js";
      scriptElement.onload=resolve;
      document.body.appendChild(scriptElement);
    });
  }
  onLoginClick() {
    this.continueClicked = !this.continueClicked;
    if (!this.continueClicked) {
      if (this.loginForm.valid) {
        this.authenticationService.login(this.loginForm.value.user_login, this.loginForm.value.user_password).subscribe(async (res: any) => {
          if (res.errorMsg) {
            alert(res.errorMsg);
          }
          else if (res.token) {
            this.invalidPassword = false;
            localStorage.setItem('showPlaceorder', "true");
            // alert("logged in successfully");
            localStorage.setItem('currentUser', JSON.stringify({
              "_id": res._id,
              "mobile": res.user_mobileNo,
              "token": res.token
            }));
            if (localStorage.getItem('product')) {
              var userCart: any = localStorage.getItem('product');
              await this.apiCallService.updateUserCart(res._id, userCart).subscribe((result: any) => {
                if (result.user_cart) {
                  localStorage.removeItem('product');
                  localStorage.setItem('currentUserCart', result.user_cart);
                  this.router.navigate(['/viewcart']);
                }
              });
            }
            else {
              localStorage.setItem('currentUserCart', res.user_cart);
              this.router.navigate(['/viewcart']);
            }

          }
          else {
            this.invalidPassword = true;
          }
        });
      }
    }
  }
  setValidation() {
    if (isNaN(+this.loginForm.value.user_login))
      this.loginForm.get("user_login").setValidators([Validators.required, Validators.email]);
    else
      this.loginForm.get("user_login").setValidators(
        [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  }

  onSaveAddressClick() {
    if (this.addressForm.valid) {
      this.addressForm.value.user_id = this.userId;
      // console.log(this.addressForm.value);
      this.apiCallService.addDeliveryAddress(this.addressForm.value).subscribe((res: any) => {
        if (res.nModified === 1) {
          this.showOrderSummary = true;
        }
      });
    }
  }

  onCancelClick() {
    this.showOrderSummary = !this.showOrderSummary;
    this.apiCallService.getDeliveryAddress(this.userId).subscribe((res: any) => {
      if (res.user_delivery_address) {
        this.addressForm.setValue(res.user_delivery_address);
        // this.showOrderSummary=true;
      }
    });
  }
  onContinueClick() {
    this.continueOrderClicked = true;
    if (!this.addScript) {
      this.addPaypalScript().then(()=>{
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
      });
    }
  }
}
