import { Injectable } from '@angular/core';
import { Database, ref, get, set, push, remove } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private db: Database) {}

  // Buscar todas categorias
  async getCategories() {
    const snapshot = await get(ref(this.db, 'categories'));
    if (snapshot.exists()) {
      // snapshot.val() retorna objeto, converto em array
      return Object.entries(snapshot.val()).map(([key, value]: any) => ({
        key,
        ...value
      }));
    }
    return [];
  }

  // Adicionar categoria
  async addCategory(name: string) {
    const newRef = push(ref(this.db, 'categories'));
    await set(newRef, { name });
  }

  // Remover categoria
  async deleteCategory(key: string) {
    await remove(ref(this.db, 'categories/' + key));
  }
}
