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

  loading = false;
  searchText = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;

    this.projectService.getAllProjects().subscribe({
      next: (res) => {
        this.projects.set(res);
        this.filteredProjects.set(res);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearch() {
    const keyword = this.searchText.toLowerCase();

    const filtered = this.projects().filter((project) =>
      project.name.toLowerCase().includes(keyword)
    );

    this.filteredProjects.set(filtered);
  }

  editProject(id: string) {
    this.router.navigate(['/projects/update', id]);
  }

  deleteProject(id: string) {
    const confirmed = confirm('Are you sure you want to delete this project?');

    if (!confirmed) return;

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: () => {
        alert('Failed to delete project');
      },
    });
  }
}