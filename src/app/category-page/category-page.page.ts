import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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

  ngOnInit() {
    // 🔍 Escuta as mudanças dos parâmetros
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

      // ✅ Agora filtra usando o campo "categories" (array)
      this.filteredProducts = allProducts.filter(p =>
        Array.isArray(p.categories) &&
        p.categories.some((c: string) =>
          c.toLowerCase() === category.toLowerCase()
        )
      );

      console.log('Produtos filtrados:', this.filteredProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos por categoria', error);
    } finally {
      this.isLoading = false;
    }
  }
}
