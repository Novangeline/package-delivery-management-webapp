import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const API_URL = '/api'

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loggedIn:boolean = false

  constructor(private http:HttpClient, private router:Router) { }

  isUserAuthenticated():boolean{
    return this.loggedIn;
  }

  signUp(username: string, password: string, confirmPassword: string) {
    let body = { username, password, confirmPassword }
    return this.http.post(API_URL + '/signup', body, httpOptions).subscribe((data:any)=>{
      this.router.navigate(['/login']);
    },
    (error)=>{
      if (error.status === 400) {
        this.router.navigate(['/invalid-data']);
      }
    })
  }

  login(username: string, password: string) {
    let body = { username, password }
    return this.http.post(API_URL + '/login', body, httpOptions).subscribe((data:any)=>{
      this.loggedIn = true;
      this.router.navigate(['/']);
    },
    (error)=>{
      if (error.status === 400) {
        this.router.navigate(['/invalid-data']);
      } 
    });
  }

}
