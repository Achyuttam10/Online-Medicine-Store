import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <p>Please enter your credentials.</p>
      <!-- Authentication logic placeholder -->
    </div>
  `,
  styles: [`
    .login-container { padding: 20px; max-width: 400px; margin: 0 auto; }
  `]
})
export class LoginComponent {}
