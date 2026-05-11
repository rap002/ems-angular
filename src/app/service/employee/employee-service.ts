import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface EmployeeRequest {

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phone: string;

  salary?: number;

  hireDate: string;
  status: string;

  departmentId?: string;
  departmentName?: string;

  roleId?: string;
  roleName?: string;

  createdAt: string;
  updatedAt: string;
}

export interface EmployeeResponse extends EmployeeRequest {

  id: string;

}

export interface Page<T> {

  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;

}

const BASE_URL = environment.baseUrl + "/api/v1/employees";

@Injectable({
  providedIn: 'root',
})

export class EmployeeService {

  constructor(
    private readonly client: HttpClient
  ) {}

  getAllEmployees = (params?: {
    size?: number,
    page?: number,
    sort?: string
  }) => {

    const path = BASE_URL;

    let httpParams = new HttpParams();

    if (params) {

      if (params.size !== undefined) {
        httpParams = httpParams.set('size', params.size);
      }

      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page);
      }

      if (params.sort) {
        httpParams = httpParams.set('sort', params.sort);
      }

    }

    return this.client.get<Page<EmployeeResponse>>(path, {
      params: httpParams
    });

  }

  getEmployeeByID = (id: string) => {

    const path = `${BASE_URL}/${id}`;

    return this.client.get<EmployeeResponse>(path);

  }

  getAllEmployeesByDepartment = (id: string) => {

    const path = `${BASE_URL}/department/${id}`;

    return this.client.get<EmployeeResponse[]>(path);

  }

  findEmployeesByName = (name?: string) => {

    const path = `${BASE_URL}/search?${name ? 'name=' + name : ""}`;

    return this.client.get<EmployeeResponse[]>(path);

  }

  addEmployee = (reqBody: EmployeeRequest) => {

    return this.client.post<EmployeeResponse>(BASE_URL, reqBody);

  }

  updateEmployee = (id: string, reqBody: EmployeeRequest) => {

    const path = `${BASE_URL}/${id}`;

    return this.client.put<EmployeeResponse>(path, reqBody);

  }

  deleteEmployee = (id: string) => {

    const path = `${BASE_URL}/${id}`;

    return this.client.delete<void>(path);

  }

  // FILTER EMPLOYEES BY STATUS
  getEmployeesByStatus = (status: string) => {

    return this.client.get<Page<EmployeeResponse>>(BASE_URL, {
      params: {
        status: status
      }
    });

  }

}