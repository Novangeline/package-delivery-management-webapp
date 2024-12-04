import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string = ''
  password: string = ''
  confirmPassword: string = ''

  constructor(private authService: AuthenticationService, private router:Router) {}

  signUp() {
    this.authService.signUp(this.username, this.password, this.confirmPassword);
  }

  loginPage() {
    this.router.navigate(['/login'])
  }
}
