import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cartOutline, personCircleOutline, searchOutline, notificationsOutline } from 'ionicons/icons';

addIcons({ cartOutline, personCircleOutline, searchOutline, notificationsOutline });

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class HeaderComponent implements OnInit {
  searchProductsQuery: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  async searchProducts() {
    const query = this.searchProductsQuery.trim();
    if (query) {
      this.router.navigate(['tabs/search-results'], { queryParams: { q: query } });
    } else {
      console.log('Digite algo para pesquisar!');
    }
  }
}