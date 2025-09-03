import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonList, IonItem, IonThumbnail, IonFooter, IonNote, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-little-car',
  templateUrl: './little-car.page.html',
  styleUrls: ['./little-car.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonList, IonItem, IonThumbnail, IonFooter, IonNote, IonLabel]
})

export class LittleCarPage {

  carrinho = [
    { nome: 'Boneco de Pelúcia Lagrugru', descricao: 'LABUBU', preco: 999.99, qtd: 1, imagem: 'assets/icon/labubu.png' },
    { nome: 'Garrafa de Água Olivia Rodrigo', descricao: 'STANLEY', preco: 300.90, qtd: 1, imagem: 'assets/icon/stanley.png' },
    { nome: 'Deu a Louca na Chapeuzinho Vermelho vl.1', descricao: 'DVD', preco: 150.00, qtd: 1, imagem: 'assets/icon/filme.png' }
  ];

  freteOriginal = 50.00;
  frete = this.freteOriginal; 
  cupom: string = '';
  cupomAplicado: boolean = false;

  get subtotal() {
    return this.carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
  }

  get total() {
    return this.subtotal + this.frete;
  }

  aumentarQtd(item: any) {
    item.qtd++;
  }

  diminuirQtd(item: any) {
    if (item.qtd > 1) item.qtd--;
  }

  aplicarCupom() {
    if (this.cupom.toLowerCase() === 'desconto10') {
      this.frete = 0; 
      alert('Cupom aplicado com sucesso!');
    } else {
      alert('Cupom inválido!');
    }
  }

  fecharPedido() {
    alert('Pedido finalizado!');
  }

  removerItem(index: number) {
    this.carrinho.splice(index, 1);
  }
  
}