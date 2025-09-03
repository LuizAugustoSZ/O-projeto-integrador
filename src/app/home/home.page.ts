import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HomePage implements OnInit {

  products: any[] = [];
  isLoading = true;

  constructor(private productService: ProductService) { }

  async ngOnInit() {
    await this.loadProducts();
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
}