import {Component, OnInit, Renderer2, ElementRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Data, Router, NavigationEnd} from '@angular/router';
import { ApiCallService } from '../service/api-call.service';
import { map } from 'rxjs/operators';
import { DataService } from '../service/data.service';
import { WishlistService } from '../service/wishlist.service';
import { DialogService } from '../service/dialog.service';
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy{
  products:any;
  productName: string;
  subsubcatId: string='';
  state: any;
  wishlist:string;
  searchName:string;
  searchType:string;
  searchStrategy:string;
  navigationSubscription: Subscription;
  minValue: number;
  maxValue: number;
  showSlider:boolean = false;
  productsForPriceFilter:any;
  minFilterArray:any=[];
  maxFilterArray:any=[];
  minFilterArrayCopy:any=[];
  maxFilterArrayCopy:any=[];
  minDropdownMinValue : number;
  options:any={
    // floor: 0,
    // ceil : 500,
    hideLimitLabels: true,
    hidePointerLabels: true,
    showSelectionBar: true,
    showTicks: true,
    getSelectionBarColor: ()=> ('#3F74F0')
  };
  constructor(private route: ActivatedRoute, private apiCallService: ApiCallService,
    private router: Router, private dataService: DataService, private wishlistService: WishlistService,
    private dialogService: DialogService, private renderer: Renderer2, private elementRef: ElementRef) {
    this.navigationSubscription=this.router.events.subscribe((e:any)=>{
      if(e instanceof  NavigationEnd){
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params)=>{
      if(params.subsubcat)
      {
        if(localStorage.getItem("search"))
        {
          this.searchName= JSON.parse(localStorage.getItem('search')).name;
          this.searchType= JSON.parse(localStorage.getItem('search')).type;
          this.searchStrategy="search";
          this.apiCallService.getSearchedProducts(this.searchName, this. searchType).subscribe((res:any)=>{
            var result=res;
            this.products= result;
            if(this.products.length>1)
              this.setSlider();
          });

        }
        else if(localStorage.getItem("searchedData")){
          var searchData= localStorage.getItem("searchedData");
          this.apiCallService.getSearchedProductsByWholeSearch(searchData).subscribe((res:any)=>{
            this.products= res;
            if(this.products.length>1)
              this.setSlider();
          });
        }
        else{
          this.productName= params.subsubcat;
          this.searchStrategy="subsubcat";
          this.apiCallService.getProductNameWise(this.productName).subscribe((data: [])=>{
            this.products= data;
            if(this.products.length>1)
              this.setSlider();
          });
        }

      }
      else if(params.subsubcatThroughNav)
      {
        this.searchStrategy="subsubcatThroughNav";
        this.productName= params.subsubcatThroughNav;
        // if(window.history.state.data)
        // {
        //   this.subsubcatId=window.history.state.data.subsubcatId;
        // }
        this.subsubcatId= JSON.parse(localStorage.getItem('data')).subsubcatId;
        this.apiCallService.getProductSubcatWise(this.subsubcatId).subscribe((data:any)=>{
          this.products=data;
          if(this.products.length>1)
            this.setSlider();

        });

      }
      if(localStorage.getItem('currentUser'))
      {
        var userId= JSON.parse(localStorage.getItem('currentUser'))._id;
        this.apiCallService.getUserWishList(userId).subscribe((res: any)=>{
          if(res.user_wishlist !== ''){
            this.wishlist= res.user_wishlist;
            // this.designProduct();
          }
        });
      }
    });
  }

  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

  onClick(product_id: string, product_name: string){
    localStorage.setItem('productId', product_id);
    this.router.navigate([product_name], {relativeTo: this.route});
  }

  onLikeClick(pid: string, likeid){
    if(localStorage.getItem('currentUser'))
    {
      var userId: string= JSON.parse(localStorage.getItem('currentUser'))._id;
      this.apiCallService.addProductToWishlistCall(userId, pid).subscribe((res: any)=>{
        if(res.added== true)
          document.getElementById('like'+likeid).style.color="#ff4343";
        else
          document.getElementById('like'+likeid).style.color="#C8C8C8";
        const url = this.router.url.replace(/%20+/i, ' ');
        this.router.navigate([url]);
      });
    }
    else{
      this.dialogService.openLoginForm();
    }
  }

  // designProduct()
  // {
  //   if(this.products){
  //     for(let i=0; i< this.products.length; i++ )
  //     {
  //       if(this.wishlist.includes(this.products[i]._id)){
  //         this.renderer.setStyle(this.elementRef.nativeElement.querySelector("#like"+i),"color","#ff4343");
  //       }
  //     }

  //   }

  // }

  displayLowToHigh(){
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#highTlow'),'sortby-style-div-selected');
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#newestFirst'),'sortby-style-div-selected');
    this.renderer.addClass(this.elementRef.nativeElement.querySelector('#lowThigh'),'sortby-style-div-selected');
    this.products = this.products.sort((a, b) => {
      return a.product_price - b.product_price;
    });
  }
  displayHighToLow(){
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#lowThigh'), 'sortby-style-div-selected');
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#newestFirst'), 'sortby-style-div-selected');
    this.renderer.addClass(this.elementRef.nativeElement.querySelector('#highTlow'), 'sortby-style-div-selected');
    this.products = this.products.sort((a, b) => {
      return b.product_price - a.product_price;
    });
  }
  displayNewestFirst(){
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#highTlow'), 'sortby-style-div-selected');
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#lowThigh'), 'sortby-style-div-selected');
    this.renderer.addClass(this.elementRef.nativeElement.querySelector('#newestFirst'), 'sortby-style-div-selected');
    switch (this.searchStrategy){
      case "search":
        this.apiCallService.getSearchedProducts(this.searchName, this. searchType).subscribe((res:any)=>{
          this.products= res;
        });
        break;

      case "subsubcat":
        this.apiCallService.getProductNameWise(this.productName).subscribe((data: []) => {
          this.products = data;
        });
        break;

      case "subsubcatThroughNav":
        this.apiCallService.getProductSubcatWise(this.subsubcatId).subscribe((data: any) =>{
          this.products=data;

        });
        break;

      default: break;


    }
  }
  onValueChange(minvalue: number, maxvalue: number){
    if(minvalue == this.minDropdownMinValue)
      this.elementRef.nativeElement.querySelector('#minDropdown').value = 'min';
    else
      this.elementRef.nativeElement.querySelector('#minDropdown').value = minvalue;
    this.elementRef.nativeElement.querySelector('#maxDropdown').value = maxvalue;
    this.products = this.productsForPriceFilter.filter((product: any)=> (product.product_price >= minvalue && product.product_price <= maxvalue));
   }
  setSlider(){
    this.minFilterArray=[];
    this.maxFilterArray=[];
    this.productsForPriceFilter = this.products;
    this.options.ceil = Math.max.apply(Math, this.products.map(function(o) { return o.product_price; }));
    this.options.floor = Math.min.apply(Math, this.products.map(function(o) { return o.product_price; }));
    this.maxValue = Math.max.apply(Math, this.products.map(function(o) { return o.product_price; }));
    this.minValue = Math.min.apply(Math, this.products.map(function(o) { return o.product_price; }));
    if(this.maxValue>=1 && this.maxValue<=100){
      this.options.step=10;
    }
    else if(this.maxValue>100 && this.maxValue<=1000){
      this.options.step=100;
    }
    else if(this.maxValue>1000 && this.maxValue<=10000){
      this.options.step=200;
    }
    else {
      this.options.step=500;
    }
    var incr:number = this.minValue;
    while(incr <= this.maxValue){
      if(incr == this.minValue){
        this.minFilterArray.push('min');
        this.minDropdownMinValue = this.minValue;
        this.maxFilterArray.push(incr);
        incr = incr+this.options.step;
      }
      else {
        this.maxFilterArray.push(incr);
        //if(incr+this.options.step <= this.maxValue)
          this.minFilterArray.push(incr);
        incr = incr+this.options.step;
        if(incr > this.maxValue)
          this.maxFilterArray.push(this.maxValue);
          this.minFilterArray.push(this.maxValue);
      }
    }
    this.maxFilterArray=Array.from(new Set(this.maxFilterArray));
    this.minFilterArray=Array.from(new Set(this.minFilterArray));
    this.maxFilterArrayCopy = this.maxFilterArray;
    this.minFilterArrayCopy = this.minFilterArray;
  }
  onMinChange(value:any){
    if(value == "min"){
      value = this.minDropdownMinValue;
      this.maxFilterArray = this.maxFilterArrayCopy.filter(val=> (val >= value));
      this.minValue = this.minDropdownMinValue;
    }
    else{
      this.maxFilterArray = this.maxFilterArrayCopy.filter(val=> (val > value));
      this.minValue = value;
    }
    this.onValueChange(value, this.elementRef.nativeElement.querySelector('#maxDropdown').value);
  }
  onMaxChange(value:any){
    this.minFilterArray = this.minFilterArrayCopy.filter(element=>{
      if(element == 'min') return true;
      return element < value;
    });
    var minValue = this.elementRef.nativeElement.querySelector('#minDropdown').value;
    this.maxValue = value;
    this.onValueChange(minValue=='min'? this.minDropdownMinValue : minValue, value);
  }
}