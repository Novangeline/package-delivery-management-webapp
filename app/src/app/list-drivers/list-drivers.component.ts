import { Component } from '@angular/core';
import { Driver } from '../models/driver';
import { DatabaseService } from '../services/database.service';
import { UppercaseConverterPipe } from '../pipes/uppercase-converter.pipe';
import { Package } from '../models/package';
import { KgToGConverterPipe } from "../pipes/kg-to-g-converter.pipe";

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [UppercaseConverterPipe, KgToGConverterPipe],
  templateUrl: './list-drivers.component.html',
  styleUrl: './list-drivers.component.css'
})
export class ListDriversComponent {
    drivers: Driver[]=[];
    driver: Driver = new Driver;
    assignedPackages: Package[]=[];
    selected: Boolean = false;

    constructor(private db: DatabaseService) {}

    ngOnInit() {
      this.db.getDrivers().subscribe((data:any)=>{
        this.drivers=data
      });
    }

    getAssignedPackages(id: string) {
      this.selected = true;
      this.db.getPackages().subscribe((data:any)=>{
        this.driver.assigned_packages=data.filter((pack: Package) => pack.driver_id === id)
      });
    }
}