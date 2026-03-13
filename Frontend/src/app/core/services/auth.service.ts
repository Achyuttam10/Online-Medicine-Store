import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'customer' | 'admin' | null;

export interface Customer {
  customerId?: number;
  name: string;
  email: string;
  password?: string;
}

export interface Admin {
  adminId?: number;
  name?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5065/api';

  private roleSignal = signal<UserRole>(null);
  private nameSignal = signal<string | null>(null);

  public readonly userRole = this.roleSignal.asReadonly();
  public readonly userName = this.nameSignal.asReadonly();

  public readonly isLoggedIn = computed(() => this.roleSignal() !== null);
  public readonly isCustomer = computed(() => this.roleSignal() === 'customer');
  public readonly isAdmin = computed(() => this.roleSignal() === 'admin');

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/Customer`);
  }

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/Admin`);
  }

  login(role: UserRole, name: string): void {
    this.roleSignal.set(role);
    this.nameSignal.set(name);
  }

  logout(): void {
    this.roleSignal.set(null);
    this.nameSignal.set(null);
  }
}
