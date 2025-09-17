import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Removido RouterLink
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './service/auth.service';
import { littleCar } from './service/littlercar.service';
import { addIcons } from 'ionicons';
import { 
    logInOutline, 
    logOutOutline, 
    personCircleOutline,
    homeOutline,
    pricetagsOutline
} from 'ionicons/icons';

addIcons({ 
    logInOutline, 
    logOutOutline, 
    personCircleOutline,
    homeOutline,
    pricetagsOutline
});

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule] 
})
export class AppComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    qtdCarrinho: number = 0;
    private authSubscription!: Subscription;
    private cartSubscription!: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private littleCar: littleCar,
        private menu: MenuController
    ) {}

    ngOnInit() {
        this.authSubscription = this.authService.user.subscribe(user => {
            this.isLoggedIn = !!user;
        });

        this.cartSubscription = this.littleCar.cart$.subscribe(items => {
            this.qtdCarrinho = items.length;
        });
    }

    isCurrentRoute(route: string): boolean {
        return this.router.url === route;
    }

    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login-user', { replaceUrl: true });
    }
    
    navigateToAndCloseMenu(route: string) {
        this.router.navigateByUrl(route).then(() => {
            setTimeout(() => {
                this.menu.close('start');
            }, 300);
        });
    }
}