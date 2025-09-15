import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { littleCar } from '../service/littlercar.service';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
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
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
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

  async increaseQuantity(item: any) {
    const newQuantity = item.qtd + 1;
    if (newQuantity <= item.quantity) {
      this.littleCar.updateQuantity(item, newQuantity);
    } else {
      const toast = await this.toastController.create({
        message: `Estoque máximo de ${item.quantity} unidades alcançado.`,
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  decreaseQuantity(item: any) {
    const newQuantity = item.qtd - 1;
    if (newQuantity > 0) {
      this.littleCar.updateQuantity(item, newQuantity);
    } else {
      this.littleCar.removeFromCart(this.cartItems.findIndex(i => i.id === item.id));
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
    if (this.authService.isLoggedIn()) {
      const alert = await this.alertController.create({
        header: 'Finalizar Pedido',
        message: 'Tem certeza que deseja prosseguir para o pagamento?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.router.navigate(['/payment']);
            }
          }
        ]
      });
      await alert.present();

    } else {
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
              this.router.navigate(['/login-user']);
            }
          }
        ]
      });
      await alert.present();
    }
  }
}

