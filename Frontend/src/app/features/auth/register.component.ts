import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5 text-center">
      <h2>Register</h2>
      <p class="text-muted">Registration form placeholder. Route is working!</p>
    </div>
  `
})
export class RegisterComponent {}
