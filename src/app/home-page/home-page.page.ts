import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/*import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';*/
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule]
})
export class HomePagePage implements OnInit {

  constructor() { 

    addIcons({ logoIonic })
  }

  ngOnInit() {
  }

}
