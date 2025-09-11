import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class littleCar {
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  constructor() { }

  addToCart(product: any, quantity: number) {
    const currentCart = this.cart.getValue();
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.qtd += quantity;
    } else {
      currentCart.push({ ...product, qtd: quantity });
    }
    this.cart.next(currentCart);
  }

  removeFromCart(index: number) {
    const currentCart = this.cart.getValue();
    currentCart.splice(index, 1);
    this.cart.next(currentCart);
  }

  updateQuantity(item: any, quantity: number) {
    const currentCart = this.cart.getValue();
    const cartItem = currentCart.find(i => i.id === item.id);
    if (cartItem) {
      cartItem.qtd = quantity;
      this.cart.next(currentCart);
    }
  }

  clearCart() {
    this.cart.next([]);
  }
}