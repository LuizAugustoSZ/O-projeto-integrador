import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  ellipsisVertical,
  createOutline,
  trashOutline,
  close
} from 'ionicons/icons';

addIcons({
  ellipsisVertical,
  createOutline,
  trashOutline,
  close
});

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
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  openProduct(productId: string) {
    this.router.navigateByUrl(`/product/${productId}`);
  }

  async showProductOptions(product: any) {
    const actionSheet = await this.actionSheetController.create({
      header: product.name,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => {
            this.openEditAlert(product);
          }
        },
        {
          text: 'Excluir',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => {
            this.confirmDelete(product);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async confirmDelete(product: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.deleteProduct(product.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProduct(productId: string) {
    const success = await this.productService.deleteProduct(productId);

    if (success) {
      await this.showToast('Produto excluído com sucesso.', 'success');
      this.loadProducts();
    } else {
      await this.showToast('Erro ao excluir o produto.', 'danger');
    }
  }

  async openEditAlert(product: any) {
    const alert = await this.alertController.create({
      header: `Editar ${product.name}`,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nome do Produto',
          value: product.name
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descrição',
          value: product.description
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (data) => {
            this.saveProductChanges(product.id, data.name, data.description);
          }
        }
      ]
    });
    await alert.present();
  }

  async saveProductChanges(productId: string, newName: string, newDescription: string) {
    const updatedData = {
      name: newName,
      description: newDescription
    };

    const success = await this.productService.updateProduct(productId, updatedData);

    if (success) {
      await this.showToast('Produto atualizado com sucesso!', 'success');
      this.loadProducts();
    } else {
      await this.showToast('Erro ao atualizar o produto.', 'danger');
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  async loadProducts() {
    if (this.userId) {
      this.products = await this.productService.getProductsByUser(this.userId);
    }
  }

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    this.userId = user?.uid || null;
    this.isAuthReady = true;

    this.loadProducts();
  }

  ionViewWillEnter() {
    if (this.isAuthReady) {
      this.loadProducts();
    }
  }
}