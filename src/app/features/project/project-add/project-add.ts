import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService, ProjectRequest } from '../../../service/project/project-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-add.html',
  styleUrls: ['./project-add.css']
})
export class ProjectAddComponent implements OnInit {
  projectForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['PLANNED', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const formValue = this.projectForm.value as ProjectRequest;

    this.projectService.addProject(formValue).subscribe({
      next: () => {
        this.successMessage = 'Project created successfully!';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Failed to create project';
        console.error('Error creating project:', error);
      }
    });
  }

  onReset(): void {
    this.projectForm.reset({ status: 'PLANNED' });
    this.errorMessage = '';
    this.successMessage = '';
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }

  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get startDate() { return this.projectForm.get('startDate'); }
  get endDate() { return this.projectForm.get('endDate'); }
}
