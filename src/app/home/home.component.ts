import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  navigationSubscription: Subscription;
  constructor() { 
    // this.navigationSubscription= this.router.events.subscribe((e: any)=>{
    //   if(e instanceof NavigationEnd)
    //   {

    //   }
    // });
  }

  ngOnInit() {
  }
  }
