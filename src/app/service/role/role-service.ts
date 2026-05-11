import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface RoleRequest {
  name: string;
  description: string;
  level: number;
}

export interface RoleResponse extends RoleRequest {
  id: string;
}


const BASE_URL=`${environment.baseUrl}/api/v1/roles`
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(
    private readonly client:HttpClient
  ){}
  getAllRoles=()=>{
    const path=BASE_URL
    return this.client.get<RoleResponse[]>(path)
  }
  getRoleByID=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.get<RoleResponse>(path)
  }
  addRole=(reqBody:RoleRequest)=>{
    const path=BASE_URL
    return this.client.post<RoleResponse>(path,reqBody)
  }
  updateRole=(id:string,reqBody:RoleRequest)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.put<RoleResponse>(path,reqBody)
  }
  deleteRole=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.delete<void>(path)
  }
}
