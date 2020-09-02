import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatDialogModule, MatDialogRef} from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import {MatRadioModule} from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageZoomModule } from 'ngx-image-zoom';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavigationComponent } from './navigation/navigation.component';
import { ApiCallService } from './service/api-call.service';
import { DataService } from './service/data.service';
import { PrimarySliderComponent } from './primary-slider/primary-slider.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HomeComponent } from './home/home.component';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { HomeProductComponent } from './home-product/home-product.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { CartComponent } from './cart/cart.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { DialogService } from './service/dialog.service';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { WishlistService } from './service/wishlist.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadService } from './service/file-upload.service';
import { FileUploadModule } from 'ng2-file-upload';
import { from } from 'rxjs';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { CartService } from './service/cart.service';
import {AlertService} from './service/alert.service';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrderComponent } from './order/order.component';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    PrimarySliderComponent,
    HomeComponent,
    ProductSliderComponent,
    HomeProductComponent,
    FooterComponent,
    ProductDetailComponent,
    SingleProductComponent,
    CartComponent,
    MatConfirmDialogComponent,
    LoginComponent,
    RegistrationComponent,
    FileUploadComponent,
    PlaceOrderComponent,
    WishlistComponent,
    OrderComponent
  ],
  entryComponents: [
    LoginComponent,
    MatConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    MatRadioModule,
    HttpClientModule,
    SlickCarouselModule,
    MatTooltipModule,
    NgxImageZoomModule.forRoot(),
    MatButtonModule,
    FileUploadModule,
    Ng5SliderModule
  ],
  providers: [ApiCallService, DataService, DialogService, WishlistService, FileUploadService,
    CartService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
