import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline, searchOutline, notificationsOutline,
  storefrontOutline, headsetOutline, bagHandleOutline,
  starOutline, heartOutline, pricetagOutline,
  ticketOutline, shieldOutline, videocamOutline,
  chevronForwardOutline, listOutline, carOutline, cartOutline, logOutOutline
} from 'ionicons/icons';

addIcons({
  homeOutline, searchOutline, notificationsOutline, storefrontOutline,
  headsetOutline, bagHandleOutline, starOutline, heartOutline,
  pricetagOutline, ticketOutline, shieldOutline, videocamOutline,
  chevronForwardOutline, listOutline, carOutline, cartOutline, logOutOutline
});

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class MorePage implements OnInit {

  menuItems = [
    { icon: 'home-outline', label: 'Início', action: 'home' },
    { icon: 'search-outline', label: 'Buscar', action: 'search' },
    { icon: 'headset-outline', label: 'Ajuda', action: 'help' },
    { icon: 'bag-handle-outline', label: 'Minhas compras', action: 'purchases' },
    { icon: 'star-outline', label: 'Minhas opiniões', action: 'reviews', badge: true },
    { icon: 'heart-outline', label: 'Favoritos', action: 'favorites' },
    { icon: 'ticket-outline', label: 'Cupons', action: 'coupons' },
    { icon: 'shield-outline', label: 'Seguros e assistências', action: 'insurance', badge: true },
  ];

  constructor(private navCtrl: NavController, private authService : AuthService, private router : Router) { }

  ngOnInit() { }

  handleNavigation(action: string) {
    console.log(`Navegar para: ${action}`);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login-user', { replaceUrl: true });
  }
}