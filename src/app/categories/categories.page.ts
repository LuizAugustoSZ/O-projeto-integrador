import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- necessário
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    CommonModule,   // <-- ESSENCIAL para *ngIf e *ngFor
    IonicModule,
    RouterModule
  ]
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

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
}
