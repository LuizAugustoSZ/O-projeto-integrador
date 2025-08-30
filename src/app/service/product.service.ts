import { Injectable } from '@angular/core';
import { Database, ref, push, set } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: Database) {}

   async saveProduct(product: any){
      const productsRef = ref(this.db, 'products');
      const newProductRef = push(productsRef); 
       await set(newProductRef, {
      ...product,
      createdAt: Date.now()
    });
      return newProductRef.key; 
    }
  
}
