import { Injectable } from '@angular/core';
import { Auth, user, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { ref, set } from '@firebase/database';
import { db } from 'src/app/firebase.config';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable do usuário logado
  user = user(this.auth);

  constructor(
    private auth: Auth,
  ) { }

  // -----------------------------
  // Registro de usuário
  // -----------------------------
  async register(name: string, email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await set(ref(db, 'users/' + userCredential.user.uid + '/profile'), {
      name: name,
      email: email
    });
    return userCredential.user;
  }

  // -----------------------------
  // Login
  // -----------------------------
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    
    const idToken = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    return userCredential.user;
  }

  // -----------------------------
  // Logout
  // -----------------------------
  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('authToken');
  }

  // -----------------------------
  // Verifica se existe token local
  // -----------------------------
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // -----------------------------
  // Salva endereço do usuário
  // -----------------------------
  async saveAddress(userId: string, address: { cep: string, rua: string, bairro: string, cidade: string, estado: string }) {
    try {
      const addressRef = ref(db, 'users/' + userId + '/address');
      await set(addressRef, address);
      console.log('Endereço salvo com sucesso no Realtime Database!');
    } catch (error) {
      console.error('Erro ao salvar endereço no Realtime Database:', error);
      throw error;
    }
  }

  // -----------------------------
  // Métodos atuais do usuário
  // -----------------------------
  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  getCurrentUserUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // -----------------------------
  // Novo método assíncrono para pegar usuário atual
  // -----------------------------
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = await firstValueFrom(this.user);
      return currentUser;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }
}
