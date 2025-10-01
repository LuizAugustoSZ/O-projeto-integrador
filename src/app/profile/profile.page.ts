import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Database, ref, onValue } from '@angular/fire/database';
import { User } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import {
  chevronForwardOutline
} from 'ionicons/icons';

addIcons({
  chevronForwardOutline
});


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DecimalPipe] 
})
export class ProfilePage implements OnInit, OnDestroy {
  userId: string | null = null;
  orders: any[] = [];

  private authSubscription!: Subscription;
  
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private db: Database
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe((user: User | null) => {
      this.userId = user?.uid || null;
      if (this.userId) {
        this.fetchUserOrders();
      } else {
        this.router.navigateByUrl('/login-user', { replaceUrl: true });
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  fetchUserOrders() {
    if (!this.userId) return;
    const ordersRef = ref(this.db, `users/${this.userId}/orders`);
    
    onValue(ordersRef, (snapshot) => {
      this.orders = [];
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        Object.keys(ordersData).forEach((key) => {
          const order = ordersData[key];
          this.orders.push({
            id: key,
            date: new Date(order.date).toLocaleDateString(), 
            total: order.total,
            items: order.items || []
          });
        });
      }

      this.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, (error) => {
      console.error('Erro ao buscar pedidos:', error);
    });
  }

  getItemSubtotal(item: any): number {
    return (item?.price || 0) * (item?.quantity || 0);
  }

  goBack() {
    this.navCtrl.navigateBack('/tabs/more');
  }
}