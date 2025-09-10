// src/app/product-page/product-page.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { addIcons } from 'ionicons';
import { star, starHalf, starOutline, cartOutline } from 'ionicons/icons';

addIcons({ star, starHalf, starOutline, cartOutline });

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.page.html',
  styleUrls: ['./product-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductPage implements OnInit {
  productId: string | null = null;
  product: any; 
  qtd: number = 1;
  qtdCarrinho: number = 0;
  estrelas: string[] = ['star-outline', 'star-outline', 'star-outline', 'star-outline', 'star-outline'];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    
    if (this.productId) {
      this.product = await this.productService.getProductById(this.productId);
      
      if (this.product && this.product.nota) {
        this.updateStars(this.product.nota);
      }
    }
  }

  updateStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < this.estrelas.length; i++) {
      if (i < fullStars) {
        this.estrelas[i] = 'star';
      } else if (i === fullStars && hasHalfStar) {
        this.estrelas[i] = 'star-half';
      } else {
        this.estrelas[i] = 'star-outline';
      }
    }
  }

  diminuirQtd() {
    if (this.qtd > 1) {
      this.qtd--;
    }
  }

  aumentarQtd() {
    this.qtd++;
  }

  adicionarCarrinho() {
    console.log(`Adicionado ${this.qtd} de ${this.product.nome} ao carrinho.`);
    this.qtdCarrinho += this.qtd;
  }
}