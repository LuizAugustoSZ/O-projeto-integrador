import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonListHeader, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonListHeader, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton ]
})
export class ProfilePage implements OnInit {

  userName: string = 'Amanda Silverio';
  userEmail: string = 'blablabla@gmail.com';

  editProfile() {
    alert('Editar perfil clicado!');
  }

  editPassword() {
    alert('Editar senha clicado!');
  }

  addAddress() {
    alert('Adicionar novo endereço clicado!');
  }

  addPayment() {
    alert('Adicionar método de pagamento clicado!');
  }

  produtosFavoritos: any[] = [
    {
      id: 1,
      nome: 'Natural Moisturizing Factors + HA',
      descricao: 'Supports Skin Barrier',
      foto: 'assets/icon/stanley.png',
      avaliacao: 4.3,
      vendas: 1534,
      tamanho: '100ml',
      valor: 59.90
    },
    {
      id: 2,
      nome: 'Gel de Limpeza Facial',
      descricao: 'Limpeza profunda e hidratação',
      foto: 'assets/icon/stanley.png', 
      avaliacao: 4.5,
      vendas: 876,
      tamanho: '150ml',
      valor: 45.50
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  removerProduto(id: number) {
    this.produtosFavoritos = this.produtosFavoritos.filter(produto => produto.id !== id);
    console.log(`Produto com ID ${id} removido.`);
  }

}