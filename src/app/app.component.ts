import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './service/auth.service';
import { littleCar } from './service/littlercar.service';
import { addIcons } from 'ionicons';
import { 
  logInOutline, 
  logOutOutline, 
  personCircleOutline,
  homeOutline, // Importe o novo ícone
  pricetagsOutline // Importe o novo ícone
} from 'ionicons/icons';

addIcons({ 
  logInOutline, 
  logOutOutline, 
  personCircleOutline,
  homeOutline,
  pricetagsOutline
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  qtdCarrinho: number = 0;
  private authSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private littleCar: littleCar
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.cartSubscription = this.littleCar.cart$.subscribe(items => {
      this.qtdCarrinho = items.length;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login-user', { replaceUrl: true });
  }
}