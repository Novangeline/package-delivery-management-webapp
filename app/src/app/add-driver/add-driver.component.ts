import { Component } from '@angular/core';
import { Driver } from '../models/driver';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css'
})
export class AddDriverComponent {
    driver: Driver = new Driver();
    departments: Array<string> = ['Food', 'Furniture', 'Electronic'];

    constructor(private db: DatabaseService, private router:Router) {}

    addDriver() {
      this.db.createDriver(this.driver).subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['/list-drivers']);
      }, 
      (error) => {
        if (error.status === 400) {
          this.router.navigate(['/invalid-data']);
        }
      }
    )}
}
