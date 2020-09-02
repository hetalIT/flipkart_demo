import { Component, OnInit, ElementRef} from '@angular/core';
import { ApiCallService } from '../service/api-call.service';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-primary-slider',
  templateUrl: './primary-slider.component.html',
  styleUrls: ['./primary-slider.component.css'],
  // animations: [trigger("fade", [  // fade animation
  //   // state("void", style({ opacity: 0 })),
  //   transition("void <=> *", [animate("0.5s ease-in-out", style({ transform: 'translateX(0)' }))])
  //   ])]
})
export class PrimarySliderComponent implements OnInit {
  slides = [];
  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "nextArrow":"<div class='nav-btn next-slide'><span>&#10095;</span></div>",
    "prevArrow":"<div class='nav-btn prev-slide'><span>&#10094;</span></div>",
    "dots":false,
    "infinite": true
  };
  
  constructor(private apiCallService: ApiCallService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.apiCallService.getSliderImage().subscribe((data:[])=>{
      data.forEach((element:any) => {
        this.slides.push({img: "../../"+ element.img_name});
      });
      this.slider_autoplay(0);
      
    });
  }

  private slider_autoplay(id: number){
    if(this.elementRef.nativeElement.querySelector('#slider'+id))
    {
      for(let i=0;i < this.slides.length; i++ )
      {
        this.elementRef.nativeElement.querySelector('#slider'+i).style.display="none";
      }
      this.elementRef.nativeElement.querySelector('#slider'+id).style.display="block";
      id=id+1;
      if(id >= this.slides.length){ id=0 }
      
    }
    
    setTimeout(()=>{
      this.slider_autoplay(id);
    }, 3000);
    
    
  }

  // addSlide() {
  //   this.slides.push({img: "http://placehold.it/350x150/777777"})
  // }
  
  // removeSlide() {
  //   this.slides.length = this.slides.length - 1;
  // }
  
  // slickInit(e) {
  //   console.log('slick initialized');
  // }
  
  // breakpoint(e) {
  //   console.log('breakpoint');
  // }
  
  // afterChange(e) {
  //   console.log('afterChange');
  // }
  
  // beforeChange(e) {
  //   console.log('beforeChange');
  // }

}
