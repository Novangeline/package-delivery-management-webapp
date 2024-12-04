import { Component } from '@angular/core';
import { Package } from '../models/package';
import { FormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.css'
})
export class AddPackageComponent {
  package: Package = new Package;
  driver: Driver = new Driver;
  drivers: Driver[]=[];

  constructor(private db: DatabaseService, private router:Router) {}

  ngOnInit() {
    this.db.getDrivers().subscribe((data: any)=>{
      this.drivers=data
    });
  }

  addPackage() {
    this.db.createPackage(this.package).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/list-packages']);
    },
    (error) => {
      if (error.status === 400) {
        this.router.navigate(['/invalid-data']);
      }
    }
  )}
}
