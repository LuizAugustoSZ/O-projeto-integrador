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
import { Router } from '@angular/router'; // Importe o Router
import { AuthService } from '../service/auth.service'; // importe



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
    private productService: ProductService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
  }

  goHome() {
    this.router.navigateByUrl('/home');
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

    if(
      !this.product.name ||
      !this.product.description ||
      !this.product.price || 
      !this.product.quantity ||  
      this.product.images.length === 0 || 
      this.product.categories.length === 0
      ){
      window.alert("PREENCHA TODOS OS CAMPOS!")
      
    }else{

      window.alert('produto salvo com sucesso!')

      const productId = await this.productService.saveProduct(this.product)
      

      this.product = {
        name: '',
        description: '',
        price: '',
        quantity: '',
        sendingMethods: [],
        images: [] as string[],
        categories: [] as string[]

      }

      this.goHome()

      
    }
  }
}