import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  arrowBackOutline
} from 'ionicons/icons';

addIcons({
  searchOutline,
  arrowBackOutline
});

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ]
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];
  isLoading = true;
  searchProductsQuery = "";

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.isLoading = true;
    try {
      this.categories = await this.categoryService.getCategories();
    } catch (err) {
      console.error('Erro ao carregar categorias', err);
    } finally {
      this.isLoading = false;
    }
  }

  goToCategory(categoryName: string) {
    this.router.navigate(['/tabs/category-page'], {
      queryParams: { category: categoryName }
    });
  }

  onSearchChange(event: any) {
    this.searchProductsQuery = event.detail.value;
  }

  async searchProducts() {
    const query = this.searchProductsQuery.trim();
    if (query) {
      this.router.navigate(['tabs/search-results'], { queryParams: { q: query } });
    } else {
      console.log('Digite algo para pesquisar!');
    }
  }

  goBack() {
    this.navCtrl.back();
  }

}
