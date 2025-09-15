import { Injectable } from '@angular/core';
import { Auth, user, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth'; // Importado 'user'
import { ref, set } from '@firebase/database';
import { db } from 'src/app/firebase.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usando a função 'user' corretamente importada
  user = user(this.auth); 

  constructor(
    private auth: Auth,
  ) { }

  async register(name: string, email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await set(ref(db, 'users/' + userCredential.user.uid + '/profile'), {
      name: name,
      email: email
    });
    return userCredential.user;
  }

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    
    const idToken = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    return userCredential.user;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Não é mais necessário, já que 'user' é um Observable
  // async getIdToken(): Promise<string | null> {
  //   const user = await firstValueFrom(this.user);
  //   return user ? user.getIdToken() : null;
  // }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('authToken');
  }
  
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

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  getCurrentUserUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }
}