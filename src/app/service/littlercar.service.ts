import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class littleCar {
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  constructor() { }

  addToCart(product: any, quantity: number): boolean {
    const currentCart = this.cart.getValue();
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.qtd + quantity;
      if (newQuantity <= product.quantity) {
        existingItem.qtd = newQuantity;
        this.cart.next(currentCart);
        return true;
      } else {
        return false;
      }
    } else {
      if (quantity <= product.quantity) {
        currentCart.push({ ...product, qtd: quantity });
        this.cart.next(currentCart);
        return true;
      } else {
        return false;
      }
    }
  }

  removeFromCart(index: number) {
    const currentCart = this.cart.getValue();
    currentCart.splice(index, 1);
    this.cart.next(currentCart);
  }

  updateQuantity(item: any, quantity: number): boolean {
    const currentCart = this.cart.getValue();
    const cartItem = currentCart.find(i => i.id === item.id);
    if (cartItem) {
      if (quantity > 0 && quantity <= item.quantity) {
        cartItem.qtd = quantity;
        this.cart.next(currentCart);
        return true;
      } else if (quantity <= 0) {
        this.removeFromCart(currentCart.findIndex(i => i.id === item.id));
        return true;
      }
    }
    return false;
  }

  clearCart() {
    this.cart.next([]);
  }
}