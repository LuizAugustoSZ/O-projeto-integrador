import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { ProductService } from '../service/product.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myproducts',
  templateUrl: './myproducts.page.html',
  styleUrls: ['./myproducts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgIf]
})
export class MyproductsPage implements OnInit {
  userId: string | null = null;
  isAuthReady: boolean = false;
  products: any[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  openProduct(productId: string) {
  this.router.navigateByUrl(`/product/${productId}`);
}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    this.userId = user?.uid || null;
    this.isAuthReady = true;

    if (this.userId) {
      this.products = await this.productService.getProductsByUser(this.userId);
    }
  }

  navigate(action: string) {
    this.router.navigateByUrl(action);
  }
}
