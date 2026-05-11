import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleService, RoleResponse } from '../../../service/role/role-service';
import { AuthService } from '../../../service/auth/auth-service';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css'
})
export class RoleList implements OnInit {
  private roleService = inject(RoleService);
  private authService = inject(AuthService);

  roles = signal<RoleResponse[]>([]);
  loading = signal(false);
  error = signal('');
  isAdmin = signal(false);

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    this.loadRoles();
  }

  loadRoles() {
    this.loading.set(true);
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load roles');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  deleteRole(id: string) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => this.loadRoles(),
        error: (err) => alert('Failed to delete role')
      });
    }
  }
}
