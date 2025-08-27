import { Injectable } from '@angular/core';
import { Database, ref, get} from '@angular/fire/database';

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
}
