import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>Manage medicines and view orders.</p>
      <!-- Admin dashboard logic placeholder -->
    </div>
  `,
  styles: [`
    .admin-dashboard-container { padding: 20px; }
  `]
})
export class AdminDashboardComponent {}
