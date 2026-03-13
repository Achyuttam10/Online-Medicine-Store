import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Medicine } from '../../../shared/models/medicine.model';
import { CartStateService } from '../../../core/services/cart-state.service';
import { MedicineService } from '../../../core/services/medicine.service';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medicine-list.component.html'
})
export class MedicineListComponent implements OnInit {
  private cartService = inject(CartStateService);
  private medicineService = inject(MedicineService);
  
  medicines = signal<Medicine[]>([]);
  loading = signal<boolean>(true);
  
  // Filter Signals
  searchQuery = signal<string>('');
  selectedCategory = signal<number | null>(null);
  maxPrice = signal<number>(50); // Default max price slider

  // Predefined Categories for the Sidebar
  categories = [
    { id: 1, name: 'Pain Relief' },
    { id: 2, name: 'Antibiotics' },
    { id: 3, name: 'Vitamins & Supplements' },
    { id: 4, name: 'Cold & Flu' },
    { id: 5, name: 'Digestive Health' }
  ];

  filteredMedicines = computed(() => {
    let filtered = this.medicines();
    
    // 1. Text Search
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) || 
        `cat-${m.categoryId}`.toLowerCase().includes(query)
      );
    }
    
    // 2. Category Filter
    const cat = this.selectedCategory();
    if (cat !== null) {
      filtered = filtered.filter(m => m.categoryId === cat);
    }
    
    // 3. Price Filter
    const priceLimit = this.maxPrice();
    filtered = filtered.filter(m => m.price <= priceLimit);

    return filtered;
  });

  ngOnInit(): void {
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.medicines.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load medicines:', error);
        this.loading.set(false);
      }
    });
  }

  addToCart(medicine: Medicine): void {
    this.cartService.addToCart(medicine, 1);
  }
}
