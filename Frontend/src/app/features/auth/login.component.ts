import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Customer, Admin } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'customer' | 'admin'>('customer');
  isSubmitting = signal<boolean>(false);
  loginError = signal<string | null>(null);

  customerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  adminForm: FormGroup = this.fb.group({
    adminId: ['', Validators.required],
    secretKey: ['', Validators.required]
  });

  switchTab(tab: 'customer' | 'admin'): void {
    this.activeTab.set(tab);
    this.loginError.set(null);
    this.customerForm.reset();
    this.adminForm.reset();
  }

  onCustomerLogin(): void {
    if (this.customerForm.invalid) return;
    
    this.isSubmitting.set(true);
    this.loginError.set(null);

    const email = this.customerForm.value.email;
    const password = this.customerForm.value.password;

    this.authService.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.isSubmitting.set(false);
        const customer = customers.find(c => c.email === email && c.password === password);
        if (customer) {
          this.authService.login('customer', customer.name);
          this.router.navigate(['/home']);
        } else {
          this.loginError.set('Invalid email or password.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.loginError.set('Error connecting to server.');
      }
    });
  }

  onAdminLogin(): void {
    if (this.adminForm.invalid) return;

    this.isSubmitting.set(true);
    this.loginError.set(null);

    // The form uses adminId and secretKey, map these to the API logic.
    // The backend Admin model has Email and Password. Assuming adminId here is actually the Email, or mapping loosely.
    const adminEmail = this.adminForm.value.adminId;
    const secretKey = this.adminForm.value.secretKey;

    this.authService.getAdmins().subscribe({
      next: (admins: Admin[]) => {
        this.isSubmitting.set(false);
        const admin = admins.find(a => (a.email === adminEmail || a.adminId?.toString() === adminEmail) && a.password === secretKey);
        if (admin) {
          this.authService.login('admin', admin.name || 'Admin User');
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.loginError.set('Invalid admin credentials.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.loginError.set('Error connecting to server.');
      }
    });
  }
}
