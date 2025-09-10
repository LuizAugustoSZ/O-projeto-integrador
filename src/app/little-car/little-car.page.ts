import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { littleCar } from '../service/littlercar.service';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Importe seu serviço de autenticação
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
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService, // Injete o serviço de autenticação
    private alertController: AlertController // Injete o AlertController para exibir o modal
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

  goHome() {
    this.router.navigateByUrl('/home');
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

  async proceedToCheckout() {
    // Verifica se o usuário está logado usando o serviço de autenticação
    if (this.authService.isLoggedIn()) {
      // Se estiver logado, navega para a página de pagamento
      this.router.navigate(['/payments']);
    } else {
      // Se não estiver logado, exibe um modal
      const alert = await this.alertController.create({
        header: 'Aviso!',
        message: 'Você precisa estar logado para finalizar o pedido.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Fazer Login',
            handler: () => {
              // Redireciona para a página de login
              this.router.navigate(['/login-user']);
            }
          }
        ]
      });

      await alert.present();
    }
  }
}