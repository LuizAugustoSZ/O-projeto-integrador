import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { CategoryService } from '../service/category.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ProductService } from '../service/product.service';



/* import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonList, IonItem, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
 */

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.page.html',
  styleUrls: ['./register-product.page.scss'],
  standalone: true,
  imports: [/* IonContent, IonHeader, IonTitle, IonToolbar, */ CommonModule, FormsModule, /* IonCard, IonCardTitle, IonList, IonItem, IonInput, IonSelect, IonSelectOption,  */IonicModule]
})

export class RegisterProductPage implements OnInit {

  categories: any[] = [];
  
  product = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    sendingMethods: [],
    images: '',
    category: ''
  }
  
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService) { }

   async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
    console.log('Categories in page:', this.categories);

    }

    async saveProduct(){
      try {
        const productId = await this.productService.saveProduct(this.product)
        console.log('product saved with id:', productId)

        this.product = {
        name: '',
        description: '',
        price: '',
        quantity: '',
        sendingMethods: [],
        images: '',
        category: ''
        };

      } catch (err){
        console.log('error saving product', err);
      }
    }
  }
