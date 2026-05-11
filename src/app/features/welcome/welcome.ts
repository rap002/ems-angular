import { CommonModule } from '@angular/common';
import { AuthService, isLoggedIn } from '../../service/auth/auth-service';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {
  isLoggedIn = isLoggedIn;
}
