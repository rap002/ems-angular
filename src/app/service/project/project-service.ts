import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { get } from 'http';
import { EmployeeResponse } from '../employee/employee-service';
export interface ProjectRequest {
  name: string;
  description: string;

  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd

  status: 'active'|'inactive';
}
export interface ProjectResponse extends ProjectRequest{
  id: string;
}

export interface AssignEmployeeRequest {
  employeeId: string;
  projectRole: string;
  assignedDate?: string; // yyyy-MM-dd
}

const BASE_URL=`${environment.baseUrl}/api/v1/projects`
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private readonly client:HttpClient
  ){}

  getAllProjects=(status?:'active'|'inactive')=>{
    const path=`${BASE_URL}`
    let param=new HttpParams()
    if(status){
      param=param.append("status",status)
    }
    return this.client.get<ProjectResponse[]>(path,{
      params:param
    });
  }
  getProjectByID=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.get<ProjectResponse>(path)
  }
  addProject=(reqBody:ProjectRequest)=>{
    const path=`${BASE_URL}`
    return this.client.post<ProjectResponse>(path,reqBody)
  }
  updateProject=(id:string,reqBody:ProjectRequest)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.put<ProjectResponse>(path,reqBody)
  }
  deleteProject=(id:string)=>{
    const path=`${BASE_URL}/${id}`
    return this.client.delete<void>(path)
  }
  assignEmployee=(id:string,reqBody:AssignEmployeeRequest)=>{
    const path=`${BASE_URL}/${id}/employees`
    return this.client.post<void>(path,reqBody)
  }
  removeEmployeeFromProject=(project_id:string,employee_id:string)=>{
    const path=`${BASE_URL}/${project_id}/employees/${employee_id}`
    return this.client.delete<void>(path)
  }
  getProjectEmployees=(id:string)=>{
    const path=`${BASE_URL}/${id}/employees`
    return this.client.get<EmployeeResponse[]>(path)
  }
  getEmployeeAssignedProjects=(id:string)=>{
    const path=`${BASE_URL}/employee/${id}`
    return this.client.get<ProjectResponse[]>(path)
  }
}
