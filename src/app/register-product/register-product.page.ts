import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { CategoryService } from '../service/category.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ProductService } from '../service/product.service';
import { addIcons } from 'ionicons';
import { backspaceOutline, menuOutline } from 'ionicons/icons'; // Importado os ícones de back e menu

addIcons({ backspaceOutline, menuOutline }); // Adicionado os ícones para uso no HTML

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.page.html',
  styleUrls: ['./register-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})

export class RegisterProductPage implements OnInit {

  categories: any[] = [];

  product = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    sendingMethods: [],
    images: [] as string[],
    categories: [] as string[]
  }

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
  }

  async pickFiles() {
    try {
      const result = await FilePicker.pickFiles({
        types: ['image/png', 'image/jpeg'],
        readData: true
      });

      if (result.files.length > 0) {
        result.files.forEach(file => {
          if (file.data) {
            const mimeType = file.mimeType || 'image/jpeg';
            this.product.images.push(`data:${mimeType};base64,${file.data}`);
          }
        });
      }
    } catch (err) {
      console.log('Erro ao selecionar arquivos:', err);
    }
  }

  pickPhotoAssets() {
    this.pickFiles()
  }

  async takePhotoCamera() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    const fileName = `photo_${Date.now()}.jpeg`

    await Filesystem.writeFile({
      path: fileName,
      data: image.base64String!,
      directory: Directory.Data
    });

    const fileUri = (await Filesystem.getUri({
      path: fileName,
      directory: Directory.Data
    })).uri;

    this.product.images.push(`data:image/jpeg;base64,${image.base64String}`);
  }

  async saveProduct() {
    try {
      const productId = await this.productService.saveProduct(this.product)
      console.log('product saved with id:', productId)

      this.product = {
        name: '',
        description: '',
        price: '',
        quantity: '',
        sendingMethods: [],
        images: [] as string[],
        categories: [] as string[]
      };
    } catch (err) {
      console.log('error saving product', err);
    }
  }
}