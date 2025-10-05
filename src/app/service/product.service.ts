import { Injectable } from '@angular/core';
import { Database, query, ref, orderByChild, equalTo, push, set, get, child } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: Database) {}

  async saveProduct(product: any) {
    const productsRef = ref(this.db, 'products');
    const newProductRef = push(productsRef);
    await set(newProductRef, {
      ...product,
      createdAt: Date.now()
    });
    return newProductRef.key;
  }

  async getProducts(): Promise<any[]> {
    const productsRef = ref(this.db, 'products');
    try {
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const productsData = snapshot.val();
        return Object.keys(productsData).map(key => ({
          id: key,
          ...productsData[key]
        }));
      } else {
        console.log("No data available");
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProductById(id: string): Promise<any> {
    const productRef = child(ref(this.db, 'products'), id);
    try {
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        return { id: snapshot.key, ...snapshot.val() };
      } else {
        console.log("No such product!");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

    async getProductsByUser(userId: string): Promise<any[]> {
    const productsRef = ref(this.db, 'products');
    const q = query(productsRef, orderByChild('userId'), equalTo(userId));

    try {
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const productsData = snapshot.val();
        return Object.keys(productsData).map(key => ({
          id: key,
          ...productsData[key]
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar produtos do usuário:', error);
      return [];
    }
  }
}