import { Component, OnInit } from '@angular/core';
import {ApiCallService} from "../service/api-call.service";
import {Router} from "@angular/router";
import {DialogService} from "../service/dialog.service";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  products:any=[];
  userId: string;
  constructor(private  apiCallService: ApiCallService, private router: Router, private dialogService: DialogService) { }

  ngOnInit() {
    if(localStorage.getItem('currentUser'))
    {
      this.userId= JSON.parse(localStorage.getItem('currentUser'))._id;
      this.apiCallService.getUserWishListProducts(this.userId).subscribe((res: any)=>{
        if(res){
          this.products = res;
        }
      });
    }
  }
  onRemoveFromWishlist(productId: string){
    event.stopPropagation();
    this.dialogService.openConfirmDialog('Are you sure you want to remove this product?').afterClosed().subscribe((res: any) => {
      if (res) {
        this.apiCallService.removeProductFromWishlist(this.userId, productId).subscribe((res:any)=>{
          if(res.nModified === 1){
            this.products = this.products.filter((product:any)=> product._id !== productId);
            this.router.navigate(['/wishlist']);
          }
        });
      }
    });
  }
  onClick(product_id: string, product_name: string, subsubcategory: string){
    localStorage.setItem('productId', product_id);
    this.router.navigate(['/product', subsubcategory, product_name]);
  }

}
