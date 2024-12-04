import { Component } from '@angular/core';
import { Package } from '../models/package';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { KgToGConverterPipe } from '../pipes/kg-to-g-converter.pipe';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [KgToGConverterPipe],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.css'
})
export class DeletePackageComponent {
  package: Package = new Package;
  packages: Package[]=[];
  
  constructor(private db: DatabaseService, private router:Router) {}

  ngOnInit() {
    this.db.getPackages().subscribe((data:any)=>{
      this.packages=data
    });
  }

  deletePackage(id: any) {
    this.db.deletePackage(id).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/list-packages']);
    })
  }
}
