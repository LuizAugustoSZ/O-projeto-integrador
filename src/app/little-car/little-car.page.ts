import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { littleCar } from '../service/littlercar.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trashBinOutline, cartOutline, removeCircleOutline, addCircleOutline, trash } from 'ionicons/icons';

addIcons({ arrowBackOutline, trashBinOutline, cartOutline, removeCircleOutline, addCircleOutline, trash });

@Component({
  selector: 'app-little-car',
  templateUrl: './little-car.page.html',
  styleUrls: ['./little-car.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LittleCarPage implements OnInit, OnDestroy {
  cartItems: any[] = [];
  frete: number = 50.00;
  private cartSubscription!: Subscription;

  constructor(
    private littleCar: littleCar,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.cartSubscription = this.littleCar.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  removeFromCart(index: number) {
    this.littleCar.removeFromCart(index);
  }

  updateQuantity(item: any, quantity: number) {
    if (quantity <= 0) {
      const index = this.cartItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.littleCar.removeFromCart(index);
      }
    } else {
      this.littleCar.updateQuantity(item, quantity);
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.qtd), 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.frete;
  }

  clearCart() {
    this.littleCar.clearCart();
  }
}