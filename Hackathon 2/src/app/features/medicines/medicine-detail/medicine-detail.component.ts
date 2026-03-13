import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Medicine } from '../../../shared/models/medicine.model';
import { CartStateService } from '../../../core/services/cart-state.service';
import { MedicineService } from '../../../core/services/medicine.service';

@Component({
  selector: 'app-medicine-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medicine-detail.component.html'
})
export class MedicineDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartStateService);
  private medicineService = inject(MedicineService);

  medicine = signal<Medicine | null>(null);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.medicineService.getMedicine(id).subscribe({
      next: (med) => {
        this.medicine.set(med);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching medicine details:', err);
        this.loading.set(false);
      }
    });
  }

  addToCart(med: Medicine): void {
    this.cartService.addToCart(med, 1);
  }
}
