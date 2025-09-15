import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { addIcons } from 'ionicons';
import { personCircleOutline, settingsOutline, receiptOutline, logOutOutline, cameraOutline } from 'ionicons/icons';

addIcons({ personCircleOutline, settingsOutline, receiptOutline, logOutOutline, cameraOutline });

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  userEmail: string | null = '';

  orders = [
    { id: 1, date: '10/09/2024', total: 150.00, items: ['Produto A', 'Produto B'] },
    { id: 2, date: '05/09/2024', total: 85.50, items: ['Produto C'] },
    { id: 3, date: '01/09/2024', total: 300.25, items: ['Produto D', 'Produto E', 'Produto F'] }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userEmail = this.authService.getCurrentUserEmail();
  }

  goBack() {
    this.navCtrl.back();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login-user', { replaceUrl: true });
  }

  editProfile() {
    console.log('Editando perfil...');
  }
}


// http://googleusercontent.com/immersive_entry_chip/0

// http://googleusercontent.com/immersive_entry_chip/1