import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ApiCallService } from '../service/api-call.service';
import { Router, NavigationEnd } from '@angular/router';
import { DialogService } from '../service/dialog.service';
import { Subscription } from 'rxjs';
declare const exzoom: any;

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit, OnDestroy {
  product_id: string;
  product_image: string;
  product: any;
  product_imageList: [];
  posY: any = 0;
  exist_into_cart = false;
  local_product: any;
  navigationSubscription : Subscription;

  constructor(private apiCallService: ApiCallService, private elementRef: ElementRef,
    private router: Router, private dialogService: DialogService) { 
      this.navigationSubscription = this.router.events.subscribe((e:any)=>{
        if(e instanceof NavigationEnd){
          this.ngOnInit();
        }
      });
    }

  ngOnInit() {
    this.product_id = localStorage.getItem('productId');
    if (localStorage.getItem('currentUser')) {
      this.local_product = JSON.parse(localStorage.getItem('currentUserCart'));
      this.checkProductExist();
      var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
      this.apiCallService.getUserWishList(userId).subscribe((res: any) => {
        if (res.user_wishlist !== '') {
          if (res.user_wishlist.includes(this.product_id))
            document.getElementById('like').style.color = "#ff4343";

        }
      });
    }
    else if (localStorage.getItem('product')) {
      this.local_product = JSON.parse(localStorage.getItem('product'));
      this.checkProductExist();
    }

    this.apiCallService.getProductIdWise(this.product_id).subscribe((data: any) => {
      this.product = data[0];
      this.product_image = data[0].product_image;
      if (this.product.product_image_list)
        this.product_imageList = JSON.parse(this.product.product_image_list);

    });
  }

  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

  checkProductExist() {
    var exist_product = this.local_product.filter(product => { return product._id === this.product_id; });
    exist_product.length <= 0 ? this.exist_into_cart = false : this.exist_into_cart = true
  }
  zoomIn(event) {
    var element = document.getElementById("overlay");
    // console.log(element);
    element.style.display = "inline-block";
    var img = document.getElementById("imgZoom");
    var img2 = document.getElementById("imgZoom2");
    var posX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
    var posY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
    //this.posY=posY;
    // img2.style.transform="translate3d(0px, "+(-posY*3)+"px, 0px)";
    element.style.backgroundPosition = "0px " + (-posY * 1.7) + "px";
    // console.log(posY);
    //element.style.backgroundPosition=(-posX)+"px "+(-posY)+"px";
    // element.style.backgroundPosition="10% 10%";
  }

  zoomOut() {
    var element = document.getElementById("overlay");
    element.style.display = "none";
  }

  onBtnClick() {
    this.product['user_quantity'] = 1;
    if (localStorage.getItem('currentUser')) {
      var userid: string = JSON.parse(localStorage.getItem('currentUser'))._id;
      var productToAdd = JSON.stringify([this.product]);
      if (!this.exist_into_cart) {
        this.apiCallService.updateUserCart(userid, productToAdd).subscribe((res: any) => {
          // console.log(res);console.log(typeof res);
          if (res) {
            localStorage.setItem('currentUserCart', res.user_cart);
            this.router.navigate(['/viewcart']);
          }
        });
      }
      else
        this.router.navigate(['/viewcart']);

    }
    else {
      if (!localStorage.getItem('product')) {
        localStorage.setItem('product', JSON.stringify([this.product]));
      }
      else {

        if (!this.exist_into_cart) {
          this.local_product.push(this.product);
          localStorage.setItem('product', JSON.stringify(this.local_product));
        }
      }
      this.router.navigate(['/viewcart']);
    }
  }

  onLikeClick() {
    if (localStorage.getItem('currentUser')) {
      var userId: string = JSON.parse(localStorage.getItem('currentUser'))._id;
      this.apiCallService.addProductToWishlistCall(userId, this.product_id).subscribe((res: any) => {
        if (res.added)
          document.getElementById('like').style.color = "#ff4343";
        else
          document.getElementById('like').style.color = "#C8C8C8";
      });
    }
    else {
      this.dialogService.openLoginForm();
    }
  }

  onBuyNowClick() {
   localStorage.setItem('showPlaceorder',"true");
   this.onBtnClick();
  }

}


// [
//   {"imgName": "assets/img/realme-3-pro-rmx1851-original-imaffnummgzjf4jv.jpeg"},
//   {"imgName": "assets/img/realme-3-pro-rmx1851-original-imaffnumpvyspcgs.jpeg"},  
//   {"imgName": "assets/img/realme-3-pro-rmx1851-original-imaffnumwkxstazt.jpeg"},
//   {"imgName": "assets/img/realme-3-pro-rmx1851-original-imaffnumvkgjzuyc.jpeg"},
//   {"imgName": "assets/img/realme-3-pro-rmx1851-original-imaffnum5hvkepgz.jpeg"},
//   {"imgName": "assets/img/realme-3-pro-rmx-1851-original-imaffnumwp5msus9.jpeg"}
// ]
// realme-3-pro-rmx-1851-original-imaffnumhthkggzg.jpeg

