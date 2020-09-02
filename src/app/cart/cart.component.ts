import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DialogService } from '../service/dialog.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ApiCallService } from '../service/api-call.service';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart.service';
import {Alert} from "selenium-webdriver";
import {AlertService} from "../service/alert.service";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: any = [];
  cartForm: FormGroup;
  total_price: number = 0;
  isUserLoggedIn: boolean = false;
  userMobile: string;
  isPlaceOrderClicked: boolean = false;
  navigationSubscription: Subscription;

  constructor(private router: Router, private dialogService: DialogService,
    private elementRef: ElementRef, private apiCallService: ApiCallService,
    private route: ActivatedRoute, private cartService: CartService,
    private alertService: AlertService) {
      this.navigationSubscription = this.router.events.subscribe((e:any)=>{
        if(e instanceof NavigationEnd)
        {
          this.ngOnInit();
        }
      });
    }

  ngOnInit() {
    if(this.alertService.orderSuccessful){
      alert("Payment and Order Completed Successfully");
      this.alertService.orderSuccessful=false;
    }
    if(localStorage.getItem('showPlaceorder')){
      this.isPlaceOrderClicked= true;
      localStorage.removeItem('showPlaceorder');
    }
    else{
      this.isPlaceOrderClicked= false;
    }
    if (localStorage.getItem('currentUser')) {
      this.cartProducts = JSON.parse(localStorage.getItem('currentUserCart'));
      this.cartService.calculateTotalPrice(this.cartProducts).subscribe((res:number)=>{
        this.total_price = res;
      });
      this.isUserLoggedIn = true;
      this.userMobile = JSON.parse(localStorage.getItem('currentUser')).mobile;
    }
    else if (localStorage.getItem('product')) {
      this.cartProducts = JSON.parse(localStorage.getItem('product'));
      this.cartService.calculateTotalPrice(this.cartProducts).subscribe((res:number)=>{
        this.total_price = res;
      });
    }
    let productQuantity: FormArray = new FormArray([]);
    for (let product of this.cartProducts) {
      (<FormArray>productQuantity).push(
        new FormGroup({
          "quantity": new FormControl(product.user_quantity, [Validators.pattern(/^[1-9]+[0-9]*$/)])
        })
      );
    }
    this.cartForm = new FormGroup({
      'quantity': productQuantity
    });

    // console.log(productQuantity.controls);
  }
  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

  onClick(product_id: string, product_name: string) {
    localStorage.setItem('productId', product_id);
    this.router.navigate(['/' + product_name]);
  }
  onRemoveClick(product_id: string) {
    this.dialogService.openConfirmDialog('Are you sure you want to remove this item?').afterClosed().subscribe((res: any) => {
      if (res) {
        this.cartProducts = this.cartProducts.filter((product: any) => {
          return product._id != product_id

        });
        this.cartService.calculateTotalPrice(this.cartProducts).subscribe((res:number)=>{
          this.total_price = res;
        });
        this.cartService.setLocalStorageOnChange(this.cartProducts);
      }
    });

  }
  onPlusClick(ind: number) {
    // if(this.cartProducts[ind].user_quantity < this.cartProducts[ind].product_quantity)
    // {
    this.cartProducts[ind].user_quantity++;
    this.elementRef.nativeElement.querySelector('#product' + ind).value = this.cartProducts[ind].user_quantity;
    this.cartService.calculateTotalPrice(this.cartProducts).subscribe((res:number)=>{
      this.total_price = res;
    });
    this.cartService.setLocalStorageOnChange(this.cartProducts);
    // }
  }
  onMinusClick(ind: number) {
    this.cartProducts[ind].user_quantity--;
    this.elementRef.nativeElement.querySelector('#product' + ind).value = this.cartProducts[ind].user_quantity;
    this.cartService.calculateTotalPrice(this.cartProducts).subscribe((res:number)=>{
      this.total_price = res;
    });
    this.cartService.setLocalStorageOnChange(this.cartProducts);
  }
  onQuantityChange(quantity: any, ind: number) {
    if (+quantity <= 0) {
      this.elementRef.nativeElement.querySelector('#product' + ind).value = this.cartProducts[ind].user_quantity;
    }
    else {
      if (+quantity <= this.cartProducts[ind].product_quantity && +quantity > 0) {
        this.cartProducts[ind].user_quantity = +quantity;
      }
      else {
        this.cartProducts[ind].user_quantity = this.cartProducts[ind].product_quantity;
        this.elementRef.nativeElement.querySelector('#product' + ind).value = this.cartProducts[ind].product_quantity;
      }
      this.cartService.setLocalStorageOnChange(this.cartProducts);
    }
  }
  // calculateTotalPrice(): number {
  //   var total: number = 0;
  //   this.cartProducts.forEach((product: any) => {
  //     total += product.product_price * product.user_quantity;
  //   });
  //   return total;
  // }
  // setLocalStorageOnChange() {
  //   if (localStorage.getItem('currentUser')) {
  //     var userid: string = JSON.parse(localStorage.getItem('currentUser'))._id;
  //     this.apiCallService.removeProductFromCart(userid, JSON.stringify(this.cartProducts)).subscribe((res: any) => {
  //       localStorage.setItem('currentUserCart', res.user_cart);
  //       this.router.navigate(['/viewcart']);
  //     });
  //   }
  //   else if (localStorage.getItem('product')) {
  //     localStorage.setItem('product', JSON.stringify(this.cartProducts));
  //   }
  // }

  onCartEmptyClick() {
    if (this.isUserLoggedIn)
      this.router.navigate(['/']);
    else {
      this.dialogService.openLoginForm();
    }
  }
  onPlaceorderClick() {
    this.isPlaceOrderClicked = true;
  }
}
