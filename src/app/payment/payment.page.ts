import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cardOutline, cashOutline, checkmarkCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { PaymentService } from '../service/payment';
import { littleCar } from '../service/littlercar.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Database, ref, push, set, get, child, update } from '@angular/fire/database';

addIcons({ cardOutline, cashOutline, checkmarkCircleOutline, arrowBackOutline });

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PaymentPage implements OnInit {
  paymentStep: number = 1;
  selectedPaymentMethod: 'card' | 'pix' = 'card';
  paymentConfirmed: boolean = false;

  cardHolder: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvc: string = '';
  pixKey: string = 'E1398863-8F4A-4819-B3F7-3F3E57388C88';
  totalAmount: number = 0;

  cartItems: any[] = [];
  frete: number = 12.00;

  constructor(
    private littleCar: littleCar,
    private paymentService: PaymentService,
    private toastController: ToastController,
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private db: Database
  ) { }

  ngOnInit() {
    this.cartItems = this.littleCar.getCartItems();
    this.totalAmount = this.calculateTotal();
  }

  nextStep() {
    this.paymentStep++;
  }

  prevStep() {
    this.paymentStep--;
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.qtd), 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.frete;
  }

  async processPayment() {
    const loading = await this.loadingController.create({
      message: 'Processando pagamento...',
      spinner: 'crescent'
    });
    await loading.present();

    const totalAmount = this.calculateTotal();

    try {
      const result = await this.paymentService.processPayment(totalAmount);
      await loading.dismiss();

      if (result.success) {
        await this.saveOrderAndReduceStock();
        this.paymentConfirmed = true;
        this.paymentStep = 3;
        const toast = await this.toastController.create({
          message: 'Pagamento confirmado! Redirecionando para seu perfil.',
          duration: 3000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 3000);
      } else {
        const alert = await this.alertController.create({
          header: 'Erro no Pagamento',
          message: result.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao processar o pagamento. Tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async saveOrderAndReduceStock() {
    const userId = this.authService.getCurrentUserUid();
    if (!userId) {
      console.error('Usuário não autenticado.');
      return;
    }

    try {
      const orderRef = push(ref(this.db, `users/${userId}/orders`));
      await set(orderRef, {
        date: new Date().toISOString(),
        total: this.calculateTotal(),
        items: this.cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qtd,
          images: item.images || ''
        }))
      });

      for (const item of this.cartItems) {
        const productRef = child(ref(this.db, 'products'), item.id);
        const snapshot = await get(productRef);

        if (!snapshot.exists()) {
          console.error(`Aviso: O produto com o ID ${item.id} não foi encontrado.`);
          continue;
        }

        const productData = snapshot.val();
        const currentQuantity = productData.quantity;
        const newQuantity = currentQuantity - item.qtd;

        if (newQuantity < 0) {
          throw new Error(`Estoque insuficiente para o produto: ${item.name}.`);
        }

        await update(productRef, { quantity: newQuantity });
      }

      this.littleCar.clearCart();

    } catch (error) {
      console.error('Erro ao salvar o pedido ou reduzir o estoque:', error);
      const alert = await this.alertController.create({
        header: 'Erro na Compra',
        message: `Ocorreu um problema ao finalizar seu pedido. ${error instanceof Error ? error.message : ''}`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}