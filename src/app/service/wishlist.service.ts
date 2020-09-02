import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';

@Injectable()
export class WishlistService{
    constructor(private apiCallService: ApiCallService){}
    addProductToWishlist(userId: string, productId: string){
        // alert(userId+ ' nnnnnn '+productId);
        return this.apiCallService.addProductToWishlistCall(userId, productId);
    }

}