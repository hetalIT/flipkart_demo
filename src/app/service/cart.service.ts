import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private apiCallService: ApiCallService, private router: Router) { }
  setLocalStorageOnChange(cartProducts:[]) {
    if (localStorage.getItem('currentUser')) {
      var userid: string = JSON.parse(localStorage.getItem('currentUser'))._id;
      this.apiCallService.removeProductFromCart(userid, JSON.stringify(cartProducts)).subscribe((res: any) => {
        localStorage.setItem('currentUserCart', res.user_cart);
        this.router.navigate(['/viewcart']);
      });
    }
    else if (localStorage.getItem('product')) {
      localStorage.setItem('product', JSON.stringify(cartProducts));
    }
  }

  calculateTotalPrice(cartProducts:[]): Observable<number> {
    var total: number = 0;
    cartProducts.forEach((product: any) => {
      total += product.product_price * product.user_quantity;
    });
    return of(total);
  }

}
