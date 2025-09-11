import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterLink]
})
export class RegisterUserPage {
  name = '';
  email = '';
  password = '';
  cep = '';
  rua = '';
  bairro = '';
  cidade = '';
  estado = '';
  
  // Variáveis de erro para exibir as mensagens
  nameError: string | null = null;
  emailError: string | null = null;
  passwordError: string | null = null;
  cepError: string | null = null;
  
  registrationStep: number = 1;

  constructor(private authService: AuthService, private router: Router) {}

  // Funções de validação para cada campo
  validateName() {
    this.nameError = this.name.trim() === '' ? 'O nome é obrigatório.' : null;
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !emailRegex.test(this.email) ? 'Por favor, insira um e-mail válido.' : null;
  }

  validatePassword() {
    this.passwordError = this.password.length < 6 ? 'A senha deve ter pelo menos 6 caracteres.' : null;
  }

  // Função principal para avançar para o próximo passo
  nextStep() {
    this.validateName();
    this.validateEmail();
    this.validatePassword();

    if (this.nameError || this.emailError || this.passwordError) {
      return; // Se houver erros, impede o avanço
    }
    
    this.registrationStep = 2;
  }

  prevStep() {
    this.registrationStep = 1;
  }

  async register() {
    // Validação final do CEP antes de registrar
    if (!this.cep || !this.rua) {
        this.cepError = 'CEP é obrigatório e precisa ser buscado.';
        return;
    } else {
        this.cepError = null;
    }

    try {
      const user = await this.authService.register(this.name, this.email, this.password);

      if (user) {
        await this.authService.saveAddress(user.uid, {
          cep: this.cep,
          rua: this.rua,
          bairro: this.bairro,
          cidade: this.cidade,
          estado: this.estado
        });
      }

      console.log('Usuário registrado com sucesso!'); // Use console.log em vez de alert
      this.router.navigate(['/login-user']);
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error.message); // Use console.error em vez de alert
      // Você pode exibir uma mensagem de erro genérica na tela se quiser
    }
  }

  async buscarCep() {
    if (!this.cep) {
      this.cepError = 'Digite um CEP válido.';
      return;
    }
    this.cepError = null;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${this.cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        this.cepError = 'CEP não encontrado.';
        this.rua = '';
        this.bairro = '';
        this.cidade = '';
        this.estado = '';
        return;
      }
      this.rua = data.logradouro;
      this.bairro = data.bairro;
      this.cidade = data.localidade;
      this.estado = data.uf;
    } catch (error) {
      this.cepError = 'Erro ao buscar CEP. Verifique sua conexão ou o CEP digitado.';
      this.rua = '';
      this.bairro = '';
      this.cidade = '';
      this.estado = '';
    }
  }
}