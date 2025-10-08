import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
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
    private productService: ProductService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.categoryName = params['category'];
      if (this.categoryName) {
        await this.loadProductsByCategory(this.categoryName);
      }
    });
  }
  
  goToProductDetail(product: any) {
    const productId = product.id || product.uid; 
    
    if (productId) {
      this.router.navigate(['/tabs/product-page', productId]); 
    } else {
      console.error('Produto sem ID para navegação.');
    }
  }

  async loadProductsByCategory(category: string) {
    this.isLoading = true;
    try {
      const allProducts = await this.productService.getProducts();
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

  goBack() {
    this.navCtrl.back();
  }
}