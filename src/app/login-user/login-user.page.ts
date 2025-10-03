import { Component, OnInit } from '@angular/core';
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
export class LoginUserPage implements OnInit {
  email = '';
  password = '';

  emailError: string | null = null;
  passwordError: string | null = null;
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['tabs/home']);
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !emailRegex.test(this.email) ? 'Por favor, insira um e-mail válido.' : null;
    this.loginError = null;
  }

  validatePassword() {
    this.passwordError = this.password.length < 6 ? 'A senha deve ter pelo menos 6 caracteres.' : null;
    this.loginError = null;
  }

  async login() {
    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) {
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['tabs/home']);

    } catch (error: any) {
      this.loginError = this.getErrorMessage(error.code);
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'O endereço de e-mail é inválido.';
      case 'auth/user-disabled':
        return 'Esta conta de usuário foi desabilitada.';
      case 'auth/user-not-found':
        return 'E-mail ou senha inválidos.';
      case 'auth/wrong-password':
        return 'E-mail ou senha inválidos.';
      default:
        return 'Ocorreu um erro ao fazer login. Tente novamente.';
    }
  }
}