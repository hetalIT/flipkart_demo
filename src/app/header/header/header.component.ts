import {
  Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy, Input,
  Renderer2
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

import {map, startWith} from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
// import 'rxjs/add/operator/debounceTime';
import { DialogService } from 'src/app/service/dialog.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ApiCallService } from 'src/app/service/api-call.service';

export interface User {
  name: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  searchControl= new FormControl();
  options: string[]=["Mobiles", "Clothing", "Television", "Toys", "Camera"];
  showUp: boolean= false;
  isLoggedIn:boolean;
  filteredItems: Observable<string[]>;
  navigationSubscription: Subscription;
  searchData:any;

  catSearchResult: [];
  subcatSearchResult: [];
  subsubcatSearchResult: [];
  productSearchResult: [];
  resultData:any;
  sticky:boolean = false;
  showTempSearch:boolean= true;
  totalProductsInCart:number;
  searchProductLength: number;
  showMenu:boolean;
  wishlistCount:number;
  @ViewChild('stickyHeader') stickyDivRef: ElementRef;
  stickyDivPosition: any;
  @HostListener('window:scroll', ['$event'])
    handelScroll(){
      const windowScroll= window.pageYOffset;
      if(windowScroll > this.stickyDivPosition)
        this.sticky= true;
      else
        this.sticky= false;
    }
  constructor(private dialogService: DialogService,
    private authenticationService: AuthenticationService,private router : Router,
    private apiCallService: ApiCallService, private renderer: Renderer2,
  private elementRef: ElementRef) {
    this.navigationSubscription= this.router.events.subscribe((e: any)=>{
      if(e instanceof NavigationEnd)
      { this.ngOnInit();}
    });
  }

  ngOnInit() {
    this.apiCallService.getDataForSearch().subscribe((res:any)=>{
      this.searchData= res;
    });
    this.searchControl.valueChanges.subscribe((res:any)=>{
      if(res)
      {
        this._filter(res);
        this.resultData= [
          {
            "data": this.catSearchResult
          },
          {
            "data": this.subcatSearchResult
          },
          {
            "data": this.subsubcatSearchResult
          },
          {
            "data": this.productSearchResult
          }
        ];
        this.showTempSearch= false;
      }
      else{
        this.resultData= [];
        this.showTempSearch= true;
      }


    });

      if(localStorage.getItem('currentUser'))
      {
        this.totalProductsInCart = JSON.parse(localStorage.getItem('currentUserCart')).length;
        var userId= JSON.parse(localStorage.getItem('currentUser'))._id;
        this.apiCallService.getUserWishList(userId).subscribe((res: any)=>{
          if(res.user_wishlist !== ''){
            this.wishlistCount = res.user_wishlist.split(',').length;
          }
          else
            this.wishlistCount=null;
        });
      }
      else if(localStorage.getItem('product'))
      {
        this.totalProductsInCart=JSON.parse(localStorage.getItem('product')).length;
      }

      if(localStorage.getItem('currentUser'))
      {
        this.isLoggedIn= true;
      }
      else
        this.isLoggedIn= false;
  }
  private _filter(value: string){
    const filterValue = this._normalizeValue(value);
    this.catSearchResult=this.searchData.cat.filter((item: string)=>{
      return this._normalizeValue(item).startsWith(filterValue);
    });
    this.subcatSearchResult=this.searchData.subcat.filter((item: string)=>{
      return this._normalizeValue(item).startsWith(filterValue);
    });
    this.subsubcatSearchResult=this.searchData.subsubcat.filter((item: string)=>{
      return this._normalizeValue(item).startsWith(filterValue);
    });
    this.productSearchResult=this.searchData.products.filter((item: string)=>{
      return this._normalizeValue(item).startsWith(filterValue);
    });
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  ngAfterViewInit(){
    this.stickyDivPosition = this.stickyDivRef.nativeElement.offsetTop;
  }

  ngOnDestroy(){
    this.navigationSubscription.unsubscribe();
  }

  onLoginClick(){
    this.dialogService.openLoginForm();
  }
  onLogoutClick(){
    this.authenticationService.logout();
  }
  onSearchClick(search: string, index: number){
    this.searchControl.patchValue(search);
    localStorage.removeItem("searchedData");
    localStorage.setItem("search", JSON.stringify({"name": search, "type": index}));
    this.router.navigate(['/product',search]);
  }

  onWishlistClick(){
    this.router.navigate(['/wishlist']);
  }
  onSearchBtnClick(){
    // this.searchControl.patchValue(this.searchControl.value);
    // this.elementRef.nativeElement.querySelector("#autoDiv").focus();
    // this.renderer.setStyle(this.elementRef.nativeElement.querySelector("#autoDiv"), "display","none");
    localStorage.removeItem("search");
    localStorage.setItem("searchedData",this.searchControl.value);
    // console.log(this.resultData);
    this.router.navigate(['/product',this.searchControl.value]);
    // alert(this.searchControl.value);
  }
}
