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
import { backspaceOutline, menuOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import {ViewChild, ElementRef } from '@angular/core';
import Swiper from 'swiper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';

addIcons({ backspaceOutline, menuOutline }); 

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.page.html',
  styleUrls: ['./register-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    private navCtrl: NavController,
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
  if (
    !this.product.name ||
    !this.product.description ||
    !this.product.price ||
    !this.product.quantity ||
    this.product.images.length === 0 ||
    this.product.categories.length === 0
  ) {
    window.alert("PREENCHA TODOS OS CAMPOS!");
  } else {
    window.alert("produto salvo com sucesso!");

    const productId = await this.productService.saveProduct(this.product);

    this.product = {
      name: '',
      description: '',
      price: '',
      quantity: '',
      sendingMethods: [],
      images: [] as string[],
      categories: [] as string[],
    };

    this.swiper.slideTo(0);
    this.currentStep = 0;

    this.goProfile();
  }
}


  @ViewChild('swiperEl', { static: true }) swiperEl!: ElementRef;
swiper!: Swiper;
currentStep = 0;

ngAfterViewInit() {
  this.swiper = (this.swiperEl.nativeElement as any).swiper;
  this.swiper.on('slideChange', () => {
    this.currentStep = this.swiper.activeIndex;
  });
}

nextStep() {
  if (this.currentStep < 4) {
    this.swiper.slideNext();
  }
}

prevStep() {
  if (this.currentStep > 0) {
    this.swiper.slidePrev();
  }
}

validateStep(step: number): boolean {
  switch (step) {
    case 0: 
      return !!this.product.name && !!this.product.description && this.product.categories.length > 0;
    
    case 1:
      return !!this.product.price && !!this.product.quantity;

    case 2: 
      return this.product.images.length > 0;

    default:
      return false;
  }
}

goNextStep() {
  if (this.validateStep(this.currentStep)) {
    if (this.currentStep < 2) {
      this.nextStep();
    } else {
      this.saveProduct();
    }
  } else {
    window.alert("Preencha todos os campos obrigatórios antes de continuar!");
  }
}

goProfile(){
   this.router.navigateByUrl('/tabs/profile');
}

goBack() {
  this.navCtrl.navigateBack('/tabs/more');
}

}

