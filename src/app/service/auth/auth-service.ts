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
  private userRoles: string[] = [];

  constructor(
    private readonly client:HttpClient
  ){
    this.restoreRoles();
  }

  private restoreRoles() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem("auth");
      if (token) {
        this.userRoles = this.extractRolesFromToken(token);
      }
    }
  }

  private extractRolesFromToken(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch (e) {
      return [];
    }
  }

  isAdmin(): boolean {
    return this.userRoles.includes('ROLE_ADMIN');
  }

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
          this.userRoles = this.extractRolesFromToken(val.token);
        }
        return val
      })
    )
  }

  logout = () => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem("auth");
      this.userRoles = [];
    }
  }
}
export const isLoggedIn=()=>{
  if (typeof window !== 'undefined' && window.sessionStorage) {
    if (sessionStorage.getItem("auth")){ return true}
  }
  return false
}