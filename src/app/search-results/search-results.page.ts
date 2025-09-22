import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchResultsPage implements OnInit {
  query: string = '';
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.query = params['q'] || '';
      await this.loadProducts();
    });
  }

  async loadProducts() {
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
}
