import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login-user',
  standalone: true,
  templateUrl: './login-user.page.html',
  styleUrls: ['./login-user.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterLink]
})
export class LoginUserPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      alert('Login realizado com sucesso!');
      // Redireciona para a página principal ou outra página após o login
      this.router.navigate(['/home']);
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
    }
  }
}