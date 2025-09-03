import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonButtons, IonMenuButton, IonSearchbar, IonButton, IonIcon, IonBadge, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFooter, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.page.html',
  styleUrls: ['./product-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, CommonModule, FormsModule, IonButtons, IonMenuButton, IonSearchbar, IonButton, IonIcon, IonBadge, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFooter, IonToolbar]
})
export class ProductPagePage {

  produto = {
    nome: 'Canetas para Pintar Bobbie Goods, Touch 168 Cores',
    descricao: 'Kit profissional com 168 cores vivas',
    preco: 150.00,
    imagem: 'assets/imgs/canetas.png',
    nota: 4.5,
    avaliacoes: 1117
  };

  qtd: number = 1;
  qtdCarrinho: number = 0;

  get estrelas() {
    const estrelasCheias = Math.floor(this.produto.nota);
    const estrelas = Array(estrelasCheias).fill('star');
    if (this.produto.nota % 1 !== 0) estrelas.push('star-half');
    while (estrelas.length < 5) estrelas.push('star-outline');
    return estrelas;
  }

  aumentarQtd() {
    this.qtd++;
  }

  diminuirQtd() {
    if (this.qtd > 1) this.qtd--;
  }

  adicionarCarrinho() {
    this.qtdCarrinho += this.qtd;
    alert(`${this.qtd} item(ns) adicionados ao carrinho!`);
  }
}