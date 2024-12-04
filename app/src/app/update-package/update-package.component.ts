import { Component } from '@angular/core';
import { Package } from '../models/package';
import { DatabaseService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-package.component.html',
  styleUrl: './update-package.component.css'
})
export class UpdatePackageComponent {
  package: Package = new Package;

  constructor (private db: DatabaseService, private router:Router) {}

  updatePackage() {
    let id = this.package._id
    let destination = this.package.package_destination
    this.db.updatePackage(id, destination).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/list-packages'])
    },
    (error) => {
      if (error.status === 400) {
        this.router.navigate(['/invalid-data']);
      }
    }
  )}
}
