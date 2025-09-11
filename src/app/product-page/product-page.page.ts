import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
    private router: Router
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
      this.qtdCarrinho = cartItems.reduce((acc, item) => acc + item.qtd, 0);
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

  adicionarCarrinho() {
    if (this.product) {
      this.littleCar.addToCart(this.product, this.qtd);
      console.log(`Adicionado ${this.qtd} de ${this.product.name} ao carrinho.`);
    }
  }

    goToCart() {
    this.router.navigateByUrl('/little-car');
  }

}