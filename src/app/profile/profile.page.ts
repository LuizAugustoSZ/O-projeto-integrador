import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { littleCar } from '../service/littlercar.service';
import { addIcons } from 'ionicons';
import { personCircleOutline, settingsOutline, receiptOutline, logOutOutline, cameraOutline, pricetagOutline, searchOutline, cartOutline, logInOutline } from 'ionicons/icons';
import { Database, ref, onValue } from '@angular/fire/database';
import { User } from '@angular/fire/auth';

addIcons({ personCircleOutline, settingsOutline, receiptOutline, logOutOutline, cameraOutline, pricetagOutline, searchOutline, cartOutline, logInOutline });

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ProfilePage implements OnInit, OnDestroy {
  userEmail: string | null = '';
  userName: string | null = '';
  orders: any[] = [];
  userId: string | null = null;
  
  isLoggedIn: boolean = false; 
  qtdCarrinho: number = 0;
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private db: Database,
    private littleCar: littleCar 
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getCurrentUserEmail();
    this.userId = this.authService.getCurrentUserUid();

    this.authSubscription = this.authService.user.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;
    });

    if (this.userId) {
      this.fetchUserProfile();
      this.fetchUserOrders();
      this.cartSubscription = this.littleCar.cart$.subscribe(items => {
        this.qtdCarrinho = items.length;
      });
    } else {
      console.error('Usuário não autenticado. Redirecionando para a página de login.');
      this.router.navigateByUrl('/login-user', { replaceUrl: true });
    }
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
    const userRef = ref(this.db, `users/${this.userId}/profile`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.val();
        this.userName = profileData.name;
      }
    });
  }

  fetchUserOrders() {
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

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login-user', { replaceUrl: true });
  }

  editProfile() {
    console.log('Editando perfil...');
  }

  goBack() {
    this.navCtrl.back();
  }

  searchProducts() {
    console.log('Botão de busca clicado.');
  }
}