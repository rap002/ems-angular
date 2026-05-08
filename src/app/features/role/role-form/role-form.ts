import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RoleService, RoleRequest } from '../../../service/role/role-service';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css'
})
export class RoleForm implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleForm: FormGroup;
  isEditMode = signal(false);
  roleId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.roleId.set(id);
      this.loadRoleData(id);
    }
  }

  loadRoleData(id: string) {
    this.loading.set(true);
    this.roleService.getRoleByID(id).subscribe({
      next: (role) => {
        this.roleForm.patchValue(role);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load role data');
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.roleForm.invalid) return;

    this.loading.set(true);
    const roleData: RoleRequest = this.roleForm.value;

    const request = this.isEditMode()
      ? this.roleService.updateRole(this.roleId()!, roleData)
      : this.roleService.addRole(roleData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/roles']);
      },
      error: (err) => {
        this.error.set('Failed to save role');
        this.loading.set(false);
      }
    });
  }
}
