import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { AuthService } from '../service/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { addIcons } from 'ionicons';
import { backspaceOutline, menuOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import Swiper from 'swiper';

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

  @ViewChild('swiperEl', { static: true }) swiperEl!: ElementRef;
  swiper!: Swiper;
  currentStep = 0;

  constructor(
    private navCtrl: NavController,
    private categoryService: CategoryService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
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
    this.pickFiles();
  }

  async takePhotoCamera() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    const fileName = `photo_${Date.now()}.jpeg`;

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

  // ✅ Alerta Ionic
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
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
      await this.showAlert('Atenção', 'PREENCHA TODOS OS CAMPOS!');
    } else {
      await this.showAlert('Sucesso', 'Produto salvo com sucesso!');

      const userId = this.authService.getCurrentUserUid();

      const productToSave = {
        ...this.product,
        userId // ✅ salva o UID junto
      };

      const productId = await this.productService.saveProduct(productToSave);

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

      this.goBack();
    }
  }

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

  async goNextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < 2) {
        this.nextStep();
      } else {
        this.saveProduct();
      }
    } else {
      await this.showAlert('Atenção', 'Preencha todos os campos obrigatórios antes de continuar!');
    }
  }

  goProfile() {
    this.router.navigateByUrl('/tabs/profile');
  }

  goBack() {
    this.navCtrl.navigateBack('/tabs/more');
  }
}
