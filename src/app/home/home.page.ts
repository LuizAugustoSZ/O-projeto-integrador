import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '../service/product.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FormsModule } from '@angular/forms';
import { littleCar } from '../service/littlercar.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { CategoryService } from '../service/category.service';
import { HeaderComponent } from '../header/header.component';

register();

import { addIcons } from 'ionicons';
import { cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline, logInOutline } from 'ionicons/icons';

addIcons({ cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline, logInOutline });

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HeaderComponent]
})

export class HomePage implements OnInit, OnDestroy {
  swiperModules = [IonicSlides];
  qtdCarrinho: number = 0;
  private cartSubscription!: Subscription;
  isLoggedIn: boolean = false;

  allProducts: any[] = [];
  lowStockProducts: any[] = [];
  categories: any[] = [];
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private littleCar: littleCar,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.cartSubscription = this.littleCar.cart$.subscribe(cartItems => {
      this.qtdCarrinho = cartItems.reduce((acc, item) => acc + item.qtd, 0);
    });
  }

  async ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn();
    await this.loadProducts();
    await this.loadCategories();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  async loadProducts() {
    this.isLoading = true;
    try {
      const allProducts = await this.productService.getProducts();

      const availableProducts = allProducts.filter(product => product.quantity > 0);

      this.allProducts = availableProducts.sort((a, b) => b.id.localeCompare(a.id));

      this.lowStockProducts = this.allProducts.filter(product => product.quantity > 0 && product.quantity <= 10);

      console.log('Todos os Produtos carregados e ordenados:', this.allProducts);
      console.log('Produtos de Últimas Unidades:', this.lowStockProducts);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
    } finally {
      this.isLoading = false;
    }
  }

  async loadCategories() {
    const allCategories = await this.categoryService.getCategories();
    this.categories = allCategories;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('tabs/login-user', { replaceUrl: true });
  }

  goToProduct(id: string) {
    this.router.navigate(['/tabs/product-page', id]);
  }

  goToCategory(categoryName: string) {
    this.router.navigate(['/tabs/category-page'], {
      queryParams: { category: categoryName }
    });
  }
  
}