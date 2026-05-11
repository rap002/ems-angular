import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { AuthService } from '../../../service/auth/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  loginForm: FormGroup;

  loading = false;

  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      username: ['', [Validators.required]],

      password: ['', [Validators.required]],

    });

  }

  onSubmit() {

    // Stop if form invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.error = '';

    const { username, password } = this.loginForm.value;

    // Call backend login API
    this.authService.login(username, password).subscribe({

      next: (response) => {

        // Print backend response
        console.log('LOGIN RESPONSE:', response);

        // Save username locally
        localStorage.setItem('username', response.username);

        // Redirect everyone to HOME
        this.router.navigate(['/home']);

      },

      error: (err) => {

        this.error = 'Invalid username or password';

        this.loading = false;

        console.error(err);

      },

    });

  }

}