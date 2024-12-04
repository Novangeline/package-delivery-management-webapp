import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  drivers: number = 0
  packages: number = 0
  operations: string[] = []
  counts: number[] = []

  constructor(private db: DatabaseService) {}
  
  ngOnInit() {
    this.db.getStatistics().subscribe((data: any) => {
      this.drivers = data.driversCount;
      this.packages = data.packagesCount;
      this.operations = data.operations;
      this.counts = data.counts;
    })
  }
}
