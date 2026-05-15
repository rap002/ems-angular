import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import {
  ProjectResponse,
  ProjectService,
} from '../../../service/project/project-service';

@Component({
  selector: 'app-project-delete-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-delete-update.html',
  styleUrl: './project-delete-update.css',
})

export class ProjectDeleteUpdate implements OnInit {

  private projectService = inject(ProjectService);

  private router = inject(Router);

  projects = signal<ProjectResponse[]>([]);

  filteredProjects = signal<ProjectResponse[]>([]);

  // loading = false;

  errorMessage = '';

  searchText = '';

  ngOnInit(): void {

    this.loadProjects();

  }

  loadProjects(): void {

    console.log('LOADING PROJECTS...');

    // this.loading = true;

    this.errorMessage = '';

    this.projectService.getAllProjects().subscribe({

      next: (res: any) => {

        console.log('PROJECT RESPONSE:', res);

        // FIX RESPONSE
        const projects = Array.isArray(res)
          ? res
          : res.content || [];

        this.projects.set(projects);

        this.filteredProjects.set(projects);

        // this.loading = false;

      },

      error: (err) => {

        console.error('PROJECT API ERROR:', err);

        // this.loading = false;

        this.errorMessage = 'Failed to load projects';

      },

    });

  }

  onSearch(): void {

    const keyword = this.searchText.toLowerCase();

    const filtered = this.projects().filter((project) =>
      project.name.toLowerCase().includes(keyword)
    );

    this.filteredProjects.set(filtered);

  }

  editProject(id: string) {
    if (!id) return;
    const project = this.projects().find((item) => this.getProjectId(item) === id);
    this.router.navigate(['/projects/update', id], { state: { project } });
  }

  viewProject(id: string) {
    if (!id) return;
    const project = this.projects().find((item) => this.getProjectId(item) === id);
    this.router.navigate(['/projects', id], { state: { project } });
  }

  deleteProject(id: string) {
    if (!id) return;
    const confirmed = confirm('Are you sure you want to delete this project?');

    if (!confirmed) return;

    this.projectService.deleteProject(id).subscribe({

      next: () => {

        alert('Project deleted');

        this.loadProjects();

      },

      error: (err) => {

        console.error(err);

        alert('Failed to delete project');

      },

    });

  }

  getProjectId(project: ProjectResponse): string {
    return (project as any).id || (project as any)._id || '';
  }
}
