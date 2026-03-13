import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medicine } from '../../shared/models/medicine.model';
import { MedicineService } from '../../core/services/medicine.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private medicineService = inject(MedicineService);
  
  // Dashboard Signals
  totalOrders = signal<number>(142);
  revenue = signal<number>(2450.75);
  medicines = signal<Medicine[]>([]);
  lowStockCount = signal<number>(0);
  loading = signal<boolean>(true);

  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  itemsPerPage = 4; // Use 4 so we can see pagination

  filteredMedicines = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.medicines();
    return this.medicines().filter(m => 
      m.name.toLowerCase().includes(query) || 
      `cat-${m.categoryId}`.toLowerCase().includes(query)
    );
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredMedicines().length / this.itemsPerPage) || 1;
  });

  paginatedMedicines = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredMedicines().slice(startIndex, startIndex + this.itemsPerPage);
  });

  // Ensure current page is valid when search query changes
  updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.loading.set(true);
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.medicines.set(data);
        this.lowStockCount.set(data.filter(m => m.stockQuantity < 10 && m.stockQuantity > 0).length);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading medicines for dashboard:', err);
        this.loading.set(false);
      }
    });
  }

  deleteMedicine(id: number): void {
    if (confirm('Are you sure you want to delete this medicine?')) {
      // For now, we update local state or we could call a delete API if available
      this.medicines.update(medicines => medicines.filter(m => m.medicineId !== id));
      this.lowStockCount.set(this.medicines().filter(m => m.stockQuantity < 10 && m.stockQuantity > 0).length);
    }
  }

  editMedicine(id: number): void {
    alert(`Edit functionality for Medicine ID ${id} to be implemented.`);
  }
}
