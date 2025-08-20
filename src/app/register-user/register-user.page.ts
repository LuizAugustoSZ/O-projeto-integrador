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

  registrationStep: number = 1;

  constructor(private authService: AuthService, private router: Router) {}

  nextStep() {
    if (!this.name || !this.email || !this.password) {
      alert('Por favor, preencha todos os campos (Nome, E-mail, Senha).');
      return;
    }
    this.registrationStep = 2;
  }

  prevStep() {
    this.registrationStep = 1;
  }

  async register() {
    try {
      await this.authService.register(this.name, this.email, this.password);
      alert('Usuário registrado com sucesso!');
      this.router.navigate(['/login-user']);
    } catch (error: any) {
      alert('Erro ao registrar usuário: ' + error.message);
    }
  }

  async buscarCep() {
    if (!this.cep) {
      alert('Digite um CEP válido');
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${this.cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado');
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
      alert('Erro ao buscar CEP. Verifique sua conexão ou o CEP digitado.');
      this.rua = '';
      this.bairro = '';
      this.cidade = '';
      this.estado = '';
    }
  }
}