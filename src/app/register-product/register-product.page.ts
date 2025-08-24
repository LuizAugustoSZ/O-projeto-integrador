import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
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

  constructor() { }

  ngOnInit() {
  }

  product = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    sendingMethods: [],
    image: ''
  }

  category = {
    name: '',
  }
}
