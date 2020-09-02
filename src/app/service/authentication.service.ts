import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl:string= "http://localhost:3000";
  constructor(private http: HttpClient, private router: Router) { }
  login(user_login: string, user_password: string){
    return this.http.post(this.baseUrl+'/api/user/authenticate',{user_login, user_password});
  }
  logout(){
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserCart');
    this.router.navigate(['/']);
  }
}
