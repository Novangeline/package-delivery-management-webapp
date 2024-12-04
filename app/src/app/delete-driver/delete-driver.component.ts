import { Component } from '@angular/core';
import { Driver } from '../models/driver';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { UppercaseConverterPipe } from '../pipes/uppercase-converter.pipe';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [UppercaseConverterPipe],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css'
})
export class DeleteDriverComponent {
  driver: Driver = new Driver;
  drivers: Driver[]=[];
  
  constructor(private db: DatabaseService, private router:Router) {}

  ngOnInit() {
    this.db.getDrivers().subscribe((data:any)=>{
      this.drivers=data
    });
  }

  deleteDriver(id: any) {
    this.db.deleteDriver(id).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/list-drivers']);
    })
  }
}
