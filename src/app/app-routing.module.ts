import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { CartComponent } from './cart/cart.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import {WishlistComponent} from "./wishlist/wishlist.component";
import {OrderComponent} from "./order/order.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: "full",
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'viewcart',
    component: CartComponent
  },
  {
    path: 'file_upload',
    component: FileUploadComponent
  },
  {
    path: 'orders',
    component: OrderComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: ':productName',
    component: SingleProductComponent
  },
  {
    path: 'product/:subsubcat',
    component: ProductDetailComponent
  },
  {
    path: 'products/:subsubcatThroughNav',
    component: ProductDetailComponent,
  },
  {
    path: 'products/:subsubcatThroughNav/:productName',
    component: SingleProductComponent
  },
  {
    path: 'product/:subsubcat/:productName',
    component: SingleProductComponent
  }
  // {
  //   path: '**',
  //   redirectTo: '/'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
