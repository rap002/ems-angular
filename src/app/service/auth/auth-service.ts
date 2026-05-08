import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

export interface TokenResponse {
  token: string;
  tokenType: string;   // "Bearer"
  expiresIn: number;   // milliseconds
  username: string;
}
const BASE_URL=environment.baseUrl+"/api/v1/auth"
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly client:HttpClient
  ){}
  login=(username:string,password:string)=>{
    const path=`${BASE_URL}/login`
    return this.client.post<TokenResponse>(path,
      {
        "username": username,
        "password": password
      }).pipe(
      map((val)=>{
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem("auth",val.token)
        }
        return val
      })
    )
  }
}
export const isLoggedIn=()=>{
  if (typeof window !== 'undefined' && window.sessionStorage) {
    if (sessionStorage.getItem("auth")){ return true}
  }
  return false
}