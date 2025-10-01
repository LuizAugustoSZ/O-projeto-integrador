import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { littleCar } from '../service/littlercar.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { 
  homeOutline,
  pricetagsOutline,
  cartOutline,
  personCircleOutline,
  logInOutline,
  logOutOutline,
  searchOutline,
  reorderThreeOutline,
  personCircle
} from 'ionicons/icons';

addIcons({
  homeOutline,
  pricetagsOutline,
  cartOutline,
  personCircleOutline,
  logInOutline,
  logOutOutline,
  searchOutline,
  reorderThreeOutline,
  personCircle
});

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TabsPage implements OnInit, OnDestroy {
  qtdCarrinho: number = 0;
  isLoggedIn: boolean = false;
  private cartSubscription!: Subscription;

  constructor(
    private littleCar: littleCar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSubscription = this.littleCar.cart$.subscribe(cartItems => {
      this.qtdCarrinho = cartItems.reduce((acc, item) => acc + item.qtd, 0);
    });
  }

  ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('tabs/login-user', { replaceUrl: true });
  }
}