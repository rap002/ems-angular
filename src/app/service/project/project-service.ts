import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { EmployeeResponse } from '../employee/employee-service';

export interface ProjectRequest {

  name: string;

  description: string;

  startDate: string;

  endDate: string;

  status:
    | 'PLANNED'
    | 'ACTIVE'
    | 'ON_HOLD'
    | 'COMPLETED'
    | 'CANCELLED';

}

export interface ProjectResponse extends ProjectRequest {

  id: string;

}

export interface AssignEmployeeRequest {

  employeeId: string;

  projectRole: string;

  assignedDate?: string;

}

const BASE_URL = `${environment.baseUrl}/api/v1/projects`;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(
    private readonly client: HttpClient
  ) {}

  // GET ALL PROJECTS
  getAllProjects = (
    status?:
      | 'PLANNED'
      | 'ACTIVE'
      | 'ON_HOLD'
      | 'COMPLETED'
      | 'CANCELLED'
  ) => {

    let params = new HttpParams();

    if (status) {

      params = params.set('status', status);

    }

    return this.client.get<ProjectResponse[]>(
      BASE_URL,
      {
        params
      }
    );

  };

  // GET PROJECT BY ID
  getProjectByID = (id: string) => {

    return this.client.get<ProjectResponse>(
      `${BASE_URL}/${id}`
    );

  };

  // CREATE PROJECT
  addProject = (reqBody: ProjectRequest) => {

    return this.client.post<ProjectResponse>(
      BASE_URL,
      reqBody
    );

  };

  // UPDATE PROJECT
  updateProject = (
    id: string,
    reqBody: ProjectRequest
  ) => {

    return this.client.put<ProjectResponse>(
      `${BASE_URL}/${id}`,
      reqBody
    );

  };

  // DELETE PROJECT
  deleteProject = (id: string) => {

    return this.client.delete<void>(
      `${BASE_URL}/${id}`
    );

  };

  // ASSIGN EMPLOYEE
  assignEmployee = (
    id: string,
    reqBody: AssignEmployeeRequest
  ) => {

    return this.client.post<void>(
      `${BASE_URL}/${id}/employees`,
      reqBody
    );

  };

  // REMOVE EMPLOYEE
  removeEmployeeFromProject = (
    projectId: string,
    employeeId: string
  ) => {

    return this.client.delete<void>(
      `${BASE_URL}/${projectId}/employees/${employeeId}`
    );

  };

  // GET PROJECT EMPLOYEES
  getProjectEmployees = (id: string) => {

    return this.client.get<EmployeeResponse[]>(
      `${BASE_URL}/${id}/employees`
    );

  };

  // GET EMPLOYEE PROJECTS
  getEmployeeAssignedProjects = (id: string) => {

    return this.client.get<ProjectResponse[]>(
      `${BASE_URL}/employee/${id}`
    );

  };

}