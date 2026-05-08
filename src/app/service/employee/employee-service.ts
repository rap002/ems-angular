import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface EmployeeRequest{
  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phone: string;

  salary?: number; // optional because it can be null

  hireDate: string; // yyyy-MM-dd
  status: string;

  departmentId?: string;
  departmentName?: string;

  roleId?: string;
  roleName?: string;

  createdAt: string; // yyyy-MM-dd'T'HH:mm:ss
  updatedAt: string;
}

export interface EmployeeResponse extends EmployeeRequest{
  id: string;

  
}
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const BASE_URL=environment.baseUrl+"/api/v1/employees"
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(
    private readonly client:HttpClient
  ){}
  getAllEmployees=()=>{
    const path=BASE_URL
    return this.client.get<Page<EmployeeResponse>>(path)
  }
  getEmployeeByID=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.get<EmployeeResponse>(path)
  }
  getAllEmployeesByDepartment=(id:string)=>{
    const path=`${BASE_URL}/department/${id}`
    return this.client.get<EmployeeResponse[]>(path)
  }
  findEmployeesByName=(name?:string)=>{
    const path=`${BASE_URL}/search?${name?'name='+name:""}`
    return this.client.get<EmployeeResponse>(path)
  }
  addEmployee=(reqBody:EmployeeRequest)=>{
    const path=`${BASE_URL}`
    return this.client.post<EmployeeResponse>(path,reqBody)
  }
  updateEmployee=(id:string,reqBody:EmployeeRequest)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.put<EmployeeResponse>(path,reqBody)
  }
  deleteEmployee=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.delete<void>(path)
  }

}
