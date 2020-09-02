import { Component, OnInit, ElementRef} from '@angular/core';
import { ApiCallService } from '../service/api-call.service';
import { Category } from '../model/category.model';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{
  Menus: Category[]=[];
  subcategories: any[]=[];
  subsubcategories: any[]=[];
  subsubcategoriesList: any[]=[];
  showDiv: boolean=false;
  constructor(private apiCallService: ApiCallService, private elementRef: ElementRef,
    private router: Router, private dataService: DataService) { }

  ngOnInit() {
    // this.apiCallService.getMenus().subscribe((categories: any)=>{
    //   this.Menus= categories;
    //   });

    this.apiCallService.getData().subscribe((data: any)=>{
      this.Menus= data.cat;
      this.subcategories= data.subcat;
      this.subsubcategories= data.subsubList;
      // console.log(this.subsubcategories[0][0]);
    });

      // this.subsubcategoriesList.push(this.subsubcategories);
      // console.log('sub cat...', this.subsubcategoriesList);
  }
  onMouseOver(event){
    this.elementRef.nativeElement.querySelector('#down'+event).style.display="none";
    this.elementRef.nativeElement.querySelector('#up'+event).style.display="block";
    this.elementRef.nativeElement.querySelector('#display'+event).style.display="block";
    // console.log(this.subcategories);
    
  }
  onMouseOut(event){
    this.elementRef.nativeElement.querySelector('#down'+event).style.display="block";
    this.elementRef.nativeElement.querySelector('#up'+event).style.display="none";
    this.elementRef.nativeElement.querySelector('#display'+event).style.display="none";
  }
  onClick(id: string, name: string){
    // this.dataService.set_subsubcatId(id);
    // this.router.navigate([name], {state:{data:{subsubcatId: id}}});
    localStorage.setItem("data", JSON.stringify({subsubcatId: id}));
    this.router.navigate(['products',name]);
  }
}
