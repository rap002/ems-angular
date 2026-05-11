import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, RouterModule } from '@angular/router';

import {
  ProjectService,
  ProjectResponse
} from '../../../service/project/project-service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetailsComponent implements OnInit {

  project!: ProjectResponse;

  isLoading = true;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    console.log("PROJECT ID:", id);

    if (id) {

      this.projectService.getProjectByID(id).subscribe({

        next: (data) => {

          console.log("PROJECT DATA:", data);

          this.project = data;

          this.isLoading = false;

        },

        error: (err) => {

          console.error(err);

          this.errorMessage = 'Failed to load project';

          this.isLoading = false;

        }

      });

    }

  }

}