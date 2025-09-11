import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonInput, IonButton, IonRadio, IonRadioGroup, IonCheckbox, IonCard } from '@ionic/angular/standalone';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonItem, IonLabel, IonInput, IonButton, IonRadio, IonRadioGroup, IonCheckbox, IonCard]
})
export class PaymentPage implements OnInit {

  promoCode: string = '';
  metodoPagamento: string = 'credit';
  enderecoCobranca: string = 'mesmo';
  salvarCartao: boolean = false;

  cardNumber: string = '';
  expiryDate: string = '';
  securityCode: string = '';
  nameOnCard: string = '';

  aplicarCupom() {
    if (this.promoCode.toLowerCase() === 'desconto10') {
      alert('Cupom aplicado com sucesso!');
    } else {
      alert('Cupom inválido!');
    }
  }

  continuar() {
    if (this.metodoPagamento === 'credit') {
      if (!this.cardNumber || this.cardNumber.length < 16) {
        alert('Número do cartão inválido!');
        return;
      }
      if (!this.expiryDate) {
        alert('Informe a data de validade!');
        return;
      }
      if (!this.securityCode || this.securityCode.length < 3) {
        alert('Código de segurança inválido!');
        return;
      }
      if (!this.nameOnCard) {
        alert('Informe o nome no cartão!');
        return;
      }
    }

    alert('Pagamento processado! Continuando para revisão do pedido...');
  }

  constructor() { }

  ngOnInit() {
  }

}
