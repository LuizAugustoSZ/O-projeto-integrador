import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router'; // RouterLink REMOVIDO DAQUI
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { littleCar } from '../service/littlercar.service';
import { addIcons } from 'ionicons';
import {
  homeOutline, searchOutline, headsetOutline, bagHandleOutline,
  heartOutline, addCircleOutline, chevronForwardOutline, logOutOutline,
  settingsOutline, personCircleOutline, logInOutline
} from 'ionicons/icons';
import { Database, ref, onValue } from '@angular/fire/database';
import { User } from '@angular/fire/auth';

addIcons({
  homeOutline, searchOutline, headsetOutline, bagHandleOutline,
  heartOutline, addCircleOutline, chevronForwardOutline, logOutOutline,
  settingsOutline, personCircleOutline, logInOutline
});

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgIf]
})
export class MorePage implements OnInit, OnDestroy {
  userEmail: string | null = null;
  userName: string | null = null;
  userId: string | null = null;
  isAuthReady: boolean = false;
  qtdCarrinho: number = 0;

  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  mainNavigationItems = [
    { icon: 'home-outline', label: 'Início', action: 'home' },
    { icon: 'search-outline', label: 'Buscar/Navegar', action: 'search' },
    { icon: 'bag-handle-outline', label: 'Minhas Compras', action: 'purchases' },
    { icon: 'heart-outline', label: 'Favoritos', action: 'favorites' },
    { icon: 'headset-outline', label: 'Ajuda', action: 'help' },
  ];

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private db: Database,
    private littleCar: littleCar
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe((user: User | null) => {
      this.userId = user?.uid || null;
      this.isAuthReady = true;

      if (this.userId) {
        this.userEmail = this.authService.getCurrentUserEmail();
        this.fetchUserProfile();
        this.cartSubscription = this.littleCar.cart$.subscribe(items => {
          this.qtdCarrinho = items.length;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  fetchUserProfile() {
    if (!this.userId) return;
    const userRef = ref(this.db, `users/${this.userId}/profile`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.val();
        this.userName = profileData.name;
      }
    });
  }

  handleNavigation(action: string) {
    if (action === 'purchases') {
      if (this.userId) {
        this.router.navigateByUrl('/tabs/profile');
      } else {
        this.router.navigateByUrl('/login-user');
      }
      return;
    }

    if (action === 'register_product') {
      if (this.userId) {
        this.router.navigateByUrl('tabs/register-product');
      } else {
        this.router.navigateByUrl('/login-user');
      }
      return;
    }

    if (action === 'home') {
      this.router.navigateByUrl('/tabs/home');
      return;
    }

    if (action === 'search') {
      this.router.navigateByUrl('/tabs/search-results');
      return;
    }

    if (action === 'favorites') {
      if (this.userId) {
        this.router.navigateByUrl('/tabs/favorites');
      } else {
        this.router.navigateByUrl('/login-user');
      }
      return;
    }

    if (action === 'help') {
      this.router.navigateByUrl('/help-page');
    }

    console.log(`Navegação não mapeada para: ${action}`);
  }

  goToProfile() {
    if (this.userId) {
      this.router.navigateByUrl('/tabs/profile');
    } else {
      this.router.navigateByUrl('/login-user');
    }
  }

  editProfile() {
    if (this.userId) {
      this.router.navigateByUrl('/tabs/profile');
    } else {
      this.router.navigateByUrl('/login-user');
    }
  }

  loginOrRegister() {
    this.router.navigateByUrl('/login-user');
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login-user', { replaceUrl: true });
  }
}