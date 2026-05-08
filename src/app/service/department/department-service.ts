import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface DepartmentRequest{
  name: string;
  description: string; 
}
export interface DepartmentResponse extends DepartmentRequest{
  id: string;
}
const BASE_URL=`${environment.baseUrl}/api/v1/departments`
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(
    private client:HttpClient,
   
  ){}

  getAllDepartments=()=>{
    return this.client.get<DepartmentResponse[]>(BASE_URL)
  }
  getDepartment=(id:string)=>{
    return this.client.get<DepartmentResponse>(`${BASE_URL}/${id}`)
  }
  addDepartment=(name:string,description:string)=>{
    return this.client.post<DepartmentResponse>(BASE_URL,{
      name,
      description
    })
  }
  updateDepartment=(id:string,reqBody:DepartmentRequest)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.put<DepartmentResponse>(path,reqBody)

  }
  deleteDepartment=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.delete<void>(path)
  }
}
