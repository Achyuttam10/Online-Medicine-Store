import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Medicine } from '../../../shared/models/medicine.model';
import { CartStateService } from '../../../core/services/cart-state.service';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartStateService);
  
  // Use Signal to store API data
  medicines = signal<Medicine[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchMedicines();
  }

  fetchMedicines(): void {
    // Demo API endpoint matching .NET convention
    this.http.get<Medicine[]>('/api/medicines').subscribe({
      next: (data) => {
        this.medicines.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load medicines.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  addToCart(medicine: Medicine): void {
    this.cartService.addToCart(medicine, 1);
  }
}
