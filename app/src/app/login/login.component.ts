import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = ''
  password: string = ''

  constructor(private authService: AuthenticationService, private router:Router) {}

  login() {
    this.authService.login(this.username, this.password);
  }

  signUpPage() {
    this.router.navigate(['/signup'])
  }
}
