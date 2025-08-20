import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

import { ref, set } from '@firebase/database';
import { db } from 'src/app/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
  ) {}

  async register(name: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await set(ref(db, 'users/' + userCredential.user.uid + '/profile'), {
        name: name,
        email: email
      });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
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

  async logout() {
    await this.auth.signOut();
  }
}