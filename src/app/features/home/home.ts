import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { EmployeeService } from '../../service/employee/employee-service';

import { DepartmentService } from '../../service/department/department-service';

import { ProjectService } from '../../service/project/project-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit {

  // SERVICES
  private employeeService = inject(EmployeeService);

  private departmentService = inject(DepartmentService);

  private projectService = inject(ProjectService);

  // USER
  username = '';

  isAdmin = false;

  // COUNTS
  employeeCount = signal(0);

  departmentCount = signal(0);

  projectCount = signal(0);

  ngOnInit(): void {

    // USERNAME
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {

      this.username = storedUsername;

      this.isAdmin =
        storedUsername.toLowerCase().includes('admin');

    }

    // LOAD COUNTS
    this.loadEmployeeCount();

    this.loadDepartmentCount();

    this.loadProjectCount();

  }

  // EMPLOYEE COUNT
  loadEmployeeCount(): void {

    this.employeeService.getAllEmployees().subscribe({

      next: (response: any) => {

        const employees =
          response.content || response || [];

        this.employeeCount.set(employees.length);

      },

      error: (err) => {

        console.error('EMPLOYEE COUNT ERROR', err);

      }

    });

  }

  // DEPARTMENT COUNT
  loadDepartmentCount(): void {

    this.departmentService.getAllDepartments().subscribe({

      next: (response: any) => {

        this.departmentCount.set(response.length);

      },

      error: (err) => {

        console.error('DEPARTMENT COUNT ERROR', err);

      }

    });

  }

  // PROJECT COUNT
  loadProjectCount(): void {

    this.projectService.getAllProjects().subscribe({

      next: (response: any) => {

        const projects =
          response.content || response || [];

        this.projectCount.set(projects.length);

      },

      error: (err) => {

        console.error('PROJECT COUNT ERROR', err);

      }

    });

  }

}