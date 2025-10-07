import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.page.html',
  styleUrls: ['./category-page.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CategoryPage implements OnInit {
  categoryName: string = '';
  filteredProducts: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.categoryName = params['category'];
      if (this.categoryName) {
        await this.loadProductsByCategory(this.categoryName);
      }
    });
  }

  async loadProductsByCategory(category: string) {
    this.isLoading = true;
    try {
      const allProducts = await this.productService.getProducts();
      this.filteredProducts = allProducts.filter(p => p.category === category);
    } catch (error) {
      console.error('Erro ao carregar produtos por categoria', error);
    } finally {
      this.isLoading = false;
    }
  }
}
