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
import { cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline, logInOutline } from 'ionicons/icons';
import { CategoryService } from '../service/category.service';

register();

addIcons({ cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline, logInOutline });

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

  products: any[] = [];
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
      // Filtra os produtos para exibir apenas aqueles com estoque maior que 0
      this.products = allProducts.filter(product => product.quantity > 0);
      console.log('Produtos carregados e filtrados:', this.products);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
    } finally {
      this.isLoading = false;
    }
  }


  async loadCategories(){
    const allCategories = await this.categoryService.getCategories();
    this.categories = allCategories;
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