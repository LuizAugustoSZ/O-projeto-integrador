import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { AuthService } from '../service/auth.service';
import { littleCar } from '../service/littlercar.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { HeaderComponent } from '../header/header.component';
import { cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline, logInOutline } from 'ionicons/icons';

addIcons({ cartOutline, logOutOutline, personCircleOutline, searchOutline, menuOutline, logInOutline });

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, DecimalPipe, FormsModule, HeaderComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchResultsPage implements OnInit, OnDestroy {
  query: string = '';
  searchProductsQuery: string = ''; 
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  isLoading = true;
  isLoggedIn: boolean = false;
  qtdCarrinho: number = 0;
  private cartSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private littleCar: littleCar,
    private router: Router
  ) { }

  async ngOnInit() {
    this.cartSubscription = this.littleCar.cart$.subscribe(cartItems => {
      this.qtdCarrinho = cartItems.reduce((acc, item) => acc + item.qtd, 0);
    });

    this.route.queryParams.subscribe(async params => {
      this.query = params['q'] || '';
      this.searchProductsQuery = this.query;
      await this.loadAndFilterProducts();
    });
  }

  ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  async loadAndFilterProducts() {
    this.isLoading = true;
    try {
      this.allProducts = await this.productService.getProducts();
      this.filteredProducts = this.allProducts.filter(p =>
        p.name.toLowerCase().includes(this.query.toLowerCase())
      );
    } catch (err) {
      console.error('Erro ao buscar produtos', err);
    } finally {
      this.isLoading = false;
    }
  }
  
  async searchProducts(){
    const query = this.searchProductsQuery.trim();
    if (query) {
      this.router.navigate(['tabs/search-results'], { queryParams: { q: query } });
    } else {
      window.alert('Digite algo para pesquisar!');
    }
  }
}