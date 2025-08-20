// src/app/service/auth.service.ts
import { Injectable } from '@angular/core';
import { auth, db } from '../firebase.config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential 
} from "firebase/auth";
import { ref, set } from "firebase/database";

@Injectable({ providedIn: 'root' })
export class AuthService {

  async register(name: string, email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;
    await set(ref(db, 'users/' + user.uid), {
      name: name,
      email: email
    });

    return userCredential;
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async logout(): Promise<void> {
    return await signOut(auth);
  }
}
