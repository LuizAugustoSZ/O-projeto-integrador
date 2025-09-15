import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { addIcons } from 'ionicons';
import { personCircleOutline, settingsOutline, receiptOutline, logOutOutline, cameraOutline, pricetagOutline } from 'ionicons/icons';
import { Database, ref, onValue } from '@angular/fire/database';

addIcons({ personCircleOutline, settingsOutline, receiptOutline, logOutOutline, cameraOutline, pricetagOutline });

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  userEmail: string | null = '';
  userName: string | null = '';
  orders: any[] = [];
  userId: string | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private db: Database
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getCurrentUserEmail();
    this.userId = this.authService.getCurrentUserUid();
    
    if (this.userId) {
      this.fetchUserProfile();
      this.fetchUserOrders();
    } else {
      console.error('Usuário não autenticado. Redirecionando para a página de login.');
      this.router.navigateByUrl('/login-user', { replaceUrl: true });
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
}