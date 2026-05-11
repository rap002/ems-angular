import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { isLoggedIn } from '../../service/auth/auth-service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class Welcome implements OnInit {

  isLoggedIn = isLoggedIn;

  // Demo stats
  totalEmployees = 125;
  totalDepartments = 8;
  activeEmployees = 112;

  loading = true;

  ngOnInit(): void {

    // Fake loading animation
    setTimeout(() => {

      this.loading = false;

    }, 1000);

  }

}