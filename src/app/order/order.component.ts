import { Component, OnInit } from '@angular/core';
import {ApiCallService} from "../service/api-call.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  userId: string;
  products:any;
  amount: number;
  constructor(private  apiCallService: ApiCallService) { }

  ngOnInit() {
    if(localStorage.getItem('currentUser'))
    {
      this.userId= JSON.parse(localStorage.getItem('currentUser'))._id;
      this.apiCallService.getUserOrders(this.userId).subscribe((res: any)=>{
        if(res.user_order !=''){

          this.products = JSON.parse(res.user_order.products);
          this.amount = res.user_order.amount;
          console.log(this.products);console.log(this.amount);
        }
      });
    }
  }

}
