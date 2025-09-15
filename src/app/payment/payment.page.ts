import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cardOutline, cashOutline, checkmarkCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { PaymentService } from '../service/payment';
import { littleCar } from '../service/littlercar.service';
import { Router } from '@angular/router';

addIcons({ cardOutline, cashOutline, checkmarkCircleOutline, arrowBackOutline });

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PaymentPage implements OnInit {
  paymentStep = 1;
  totalAmount: number = 0;
  cartItems: any[] = [];
  frete: number = 50.00;
  selectedPaymentMethod: 'credit-card' | 'pix' = 'credit-card';

  cardHolder: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvc: string = '';

  pixKey: string = '00020126330014br.gov.bcb.pix0111999999999995204000053039865802BR5913FULANO DE TAL6008BRASILIA62070503***63045E1B';

  constructor(
    private littleCar: littleCar,
    private paymentService: PaymentService,
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartItems = this.littleCar.getCartItems();
    this.totalAmount = this.calculateTotal();
  }

  goBack() {
    if (this.paymentStep > 1) {
      this.paymentStep--;
    } else {
      this.navCtrl.back();
    }
  }

  nextStep() {
    if (this.paymentStep < 3) {
      this.paymentStep++;
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.qtd), 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.frete;
  }

  async processPayment() {
    const loading = await this.toastController.create({
      message: 'Processando pagamento...',
      duration: 3000,
      position: 'bottom'
    });
    await loading.present();

    let result;
    if (this.selectedPaymentMethod === 'credit-card') {
      result = await this.paymentService.processPayment(this.totalAmount);
    } else {
      result = { success: true, message: 'Pagamento via PIX simulado com sucesso!' };
    }

    await loading.dismiss();

    if (result.success) {
      this.littleCar.clearCart();
      this.paymentStep = 3;
    }

    const toast = await this.toastController.create({
      message: result.message,
      duration: 3000,
      color: result.success ? 'success' : 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}