import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiCallService {
    baseUrl: string = "http://localhost:3000";

    constructor(private http: HttpClient) { }

    addDeliveryAddress(address_data){return this.http.post(this.baseUrl+'/address/addDeliveryAddress',address_data);}
    getDeliveryAddress(_id){return this.http.post(this.baseUrl+'/address/getDeliveryAddress', {_id});}
    storeOrder(order:{}, _id){return this.http.post(this.baseUrl+'/address/addOrder',{_id, order});}

    getData() { return this.http.get(this.baseUrl + '/api/getData'); }
    getSliderImage() { return this.http.get(this.baseUrl + '/api/getSliderImage'); }
    getProductData() { return this.http.get(this.baseUrl + '/api/getProducts'); }
    getProductNameWise(name: string) { return this.http.post(this.baseUrl + '/api/getProductNameWise', { 'product_name': name }); }
    getProductSubcatWise(id: string) { return this.http.post(this.baseUrl + '/api/getProductNameWise', { 'product_subsubcategory_id': id }); }
    getProductIdWise(id: string) { return this.http.post(this.baseUrl + '/api/getProductNameWise', { '_id': id }); }
    getUserWishList(id: string) { return this.http.post(this.baseUrl + '/api/getWishList', { _id: id }); }
    getUserWishListProducts(id: string) { return this.http.post(this.baseUrl + '/api/getWishListProducts', { _id: id }); }
    getUserOrders(id: string) { return this.http.post(this.baseUrl + '/api/getOrders', { _id: id }); }
    getDataForSearch() { return this.http.get(this.baseUrl + '/api/getSearchData'); }
    getSearchedProducts(searchName: string, searchType: any) { return this.http.post(this.baseUrl + '/api/getSearchedProducts', { searchName, searchType }); }
    getSearchedProductsByWholeSearch(searchData: string) { return this.http.post(this.baseUrl + '/api/getSearchedProductsByWholeSearch', { searchData}); }

    RegisterUser(user: {}) { return this.http.post(this.baseUrl + '/api/addUser', user); }
    MobileNoExist(mobile: string) { return this.http.post(this.baseUrl + '/api/checkMobileExist', { 'user_mobileNo': mobile }); }
    addProductToWishlistCall(userId, productId) { return this.http.patch(this.baseUrl + '/api/addProductToWishlist', { userId, productId }); }

    updateUserCart(id: string, cart_data: string) { return this.http.patch(this.baseUrl + '/api/updateUserCart', { id, cart_data }); }
    removeProductFromCart(id: string, cart_data: string) { return this.http.post(this.baseUrl + '/api/removeProductFromCart', { id, cart_data }) }
    removeProductFromWishlist(userId: string,productId: string){ return this.http.post(this.baseUrl + '/api/removeProductFromWishlist', { _id: userId, productId }); }

}
