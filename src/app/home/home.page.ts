import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '../service/product.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { littleCar } from '../service/littlercar.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { addIcons } from 'ionicons';
import { cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline } from 'ionicons/icons';

register();

addIcons({ cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline });

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class HomePage implements OnInit, OnDestroy {
  swiperModules = [IonicSlides];
  qtdCarrinho: number = 0;
  private cartSubscription!: Subscription;
  isLoggedIn: boolean = false;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2.2,
    spaceBetween: 10
  };

  products: any[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private littleCar: littleCar,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    await this.loadProducts();

    this.cartSubscription = this.littleCar.cart$.subscribe(cartItems => {
      this.qtdCarrinho = cartItems.reduce((acc, item) => acc + item.qtd, 0);
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  async loadProducts() {
    this.isLoading = true;
    try {
      this.products = await this.productService.getProducts();
      console.log('Products loaded:', this.products);
    } catch (err) {
      console.error('Error loading products', err);
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login-user', { replaceUrl: true });
  }

  searchProducts() {
    console.log("Botão de busca clicado");
  }
}