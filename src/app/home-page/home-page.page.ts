import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
/*import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';*/
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


register();

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePagePage implements OnInit {

  swiperModules = [IonicSlides];

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }
  
  constructor() {

  addIcons({ logoIonic })
  }

  ngOnInit() {
  }


}
