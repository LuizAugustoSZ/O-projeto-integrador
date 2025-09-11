import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { littleCar } from '../service/littlercar.service';
import { addIcons } from 'ionicons';
import { star, starHalf, starOutline, cartOutline, arrowBackOutline, removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

addIcons({ star, starHalf, starOutline, cartOutline, arrowBackOutline, removeCircleOutline, addCircleOutline });

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.page.html',
  styleUrls: ['./product-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductPage implements OnInit, OnDestroy {
  productId: string | null = null;
  product: any; 
  qtd: number = 1;
  qtdCarrinho: number = 0;
  estrelas: string[] = ['star-outline', 'star-outline', 'star-outline', 'star-outline', 'star-outline'];
  private cartSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private littleCar: littleCar,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    
    if (this.productId) {
      this.product = await this.productService.getProductById(this.productId);
      
      if (this.product && this.product.nota) {
        this.updateStars(this.product.nota);
      }
    }

    this.cartSubscription = this.littleCar.cart$.subscribe(cartItems => {
      const cartItem = cartItems.find(item => item.id === this.productId);
      this.qtdCarrinho = cartItem ? cartItem.qtd : 0;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
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

  async adicionarCarrinho() {
    if (this.product) {
      const newQuantity = this.qtdCarrinho + this.qtd;
      if (newQuantity <= this.product.quantity) {
        this.littleCar.addToCart(this.product, this.qtd);
        const toast = await this.toastController.create({
          message: `Adicionado ${this.qtd} unidade(s) de ${this.product.name} ao carrinho.`,
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      } else {
        const toast = await this.toastController.create({
          message: `Você já tem ${this.qtdCarrinho} no carrinho. Estoque disponível: ${this.product.quantity}.`,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    }
  }

  aumentarQtd() {
    const maxQuantity = this.product.quantity - this.qtdCarrinho;
    if (this.qtd < maxQuantity) {
      this.qtd++;
    } else {
      this.toastController.create({
        message: 'Você atingiu a quantidade máxima em estoque.',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
    }
  }

  diminuirQtd() {
    if (this.qtd > 1) {
      this.qtd--;
    }
  }

  goToCart() {
    this.router.navigateByUrl('/little-car');
  }
}