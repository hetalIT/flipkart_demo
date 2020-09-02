import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../service/api-call.service';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit {
  product_details:[]= [];
  slideConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 3,
    "nextArrow":"<div class='nav-btn next-slide custom-slide'><span>&#10095;</span></div>",
    "prevArrow":"<div class='nav-btn prev-slide custom-slide'><span>&#10094;</span></div>",
    "dots":false,
    "infinite": false
  };
  constructor(private apiCallService: ApiCallService) { }

  ngOnInit() {
    this.apiCallService.getProductData().subscribe((data:[])=>{
      this.product_details= data;
    });
  }
  onProductClick(){
    localStorage.removeItem("search");
    localStorage.removeItem("searchedData");
  }

}
