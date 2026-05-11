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
const AUTH_KEY = "auth";

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
};

const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, token);
    sessionStorage.setItem(AUTH_KEY, token);
  }
};

const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }
};

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
    const token = getAuthToken();
    if (token) {
      this.userRoles = this.extractRolesFromToken(token);
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
        setAuthToken(val.token);
        this.userRoles = this.extractRolesFromToken(val.token);
        return val
      })
    )
  }

  logout = () => {
    clearAuthToken();
    this.userRoles = [];
  }
}
export const isLoggedIn=()=>{
  return !!getAuthToken();
}
