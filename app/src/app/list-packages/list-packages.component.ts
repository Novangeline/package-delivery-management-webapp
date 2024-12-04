import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Package } from '../models/package';
import { KgToGConverterPipe } from '../pipes/kg-to-g-converter.pipe';
import { Driver } from '../models/driver';
import { UppercaseConverterPipe } from "../pipes/uppercase-converter.pipe";

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [KgToGConverterPipe, UppercaseConverterPipe],
  templateUrl: './list-packages.component.html',
  styleUrl: './list-packages.component.css'
})
export class ListPackagesComponent {
  packages: Package[]=[];
  driver: Driver[] = [];
  selected: Boolean = false;

  constructor(private db: DatabaseService) {}

  ngOnInit() {
    this.db.getPackages().subscribe((data:any)=>{
      this.packages = data
    });
  }

  getAssignedDriver(id: string) {
    this.selected = true;
    this.db.getDrivers().subscribe((data:any)=>{
      this.driver = data.filter((driver: Driver) => driver._id === id)
      console.log(this.driver);
    })
  }
}
