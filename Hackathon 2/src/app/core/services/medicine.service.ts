import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../../shared/models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5065/api/Medicine';

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl);
  }

  getMedicine(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/${id}`);
  }
}
