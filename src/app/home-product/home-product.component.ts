import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-product',
  templateUrl: './home-product.component.html',
  styleUrls: ['./home-product.component.css']
})
export class HomeProductComponent implements OnInit {
  images:{}[]= [
    { imgsrc: 'assets/img/man_clothing.png'},
    { imgsrc: 'assets/img/soundbars.png'},
    { imgsrc: 'assets/img/washing_machine.png'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
