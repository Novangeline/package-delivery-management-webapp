import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-driver.component.html',
  styleUrl: './update-driver.component.css'
})
export class UpdateDriverComponent {
  driver: Driver = new Driver;
  departments: Array<string> = ['Food', 'Furniture', 'Electronic'];
  constructor (private db: DatabaseService, private router:Router) {}
  updateDriver() {
    let id = this.driver._id;
    let licence = this.driver.driver_licence;
    let department = this.driver.driver_department;
    this.db.updateDriver(id, licence, department).subscribe((data: any) => {
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
