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

  // Variáveis de erro para exibir as mensagens
  emailError: string | null = null;
  passwordError: string | null = null;
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Funções de validação em tempo real
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !emailRegex.test(this.email) ? 'Por favor, insira um e-mail válido.' : null;
    this.loginError = null; // Limpa o erro de login se o usuário começar a digitar
  }

  validatePassword() {
    this.passwordError = this.password.length < 6 ? 'A senha deve ter pelo menos 6 caracteres.' : null;
    this.loginError = null; // Limpa o erro de login se o usuário começar a digitar
  }

  async login() {
    // Validação inicial antes de tentar o login
    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) {
      return; // Impede o login se houver erros nos campos
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      this.loginError = this.getErrorMessage(error.code); // Define a mensagem de erro
    }
  }

  // Mapeia códigos de erro do Firebase para mensagens amigáveis
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