import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiUrl : string = environment.baseApiUrl;
  private userPlayload : any;
  constructor(private http : HttpClient , private router :Router) { 
    this.userPlayload = this.decodedToken();
  }

  signup(userObj:any){
    let formData = new FormData();
    formData.append("firstName",userObj.firstName);
    formData.append("lastName",userObj.lastName);
    formData.append("email",userObj.email);
    formData.append("username",userObj.username);
    formData.append("password",userObj.password);
    formData.append("imageFile",userObj.imageFile??"");
    return this.http.post<any>(this.baseApiUrl + 'api/User/register' , formData)
  }

  login(loginObj:any){
    return this.http.post<any>(this.baseApiUrl + 'api/User/authenticate' , loginObj)

  }

  storeToken(tokenValue : string){
    localStorage.setItem('token' , tokenValue)
  }

  storeUser(userValue: any) {
    const userString = JSON.stringify(userValue);
    localStorage.setItem('user', userString);
  }


  getToken(){
    return localStorage.getItem('token')
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token') // the "!!" convert the string to a boolean
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }


  getFullNameFromToken(){
    if(this.userPlayload){
      return this.userPlayload.unique_name;
    }
  }

  getRoleFromToken(){
    if(this.userPlayload){
      return this.userPlayload.role;
    }
  }

}
