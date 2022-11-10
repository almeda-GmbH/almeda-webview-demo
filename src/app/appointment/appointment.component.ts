import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-appointment',
    templateUrl: 'appointment.component.html',
    styleUrls: ['appointment.component.scss']
})

export class AppointmentPage implements OnInit, AfterViewInit {
    joinLink = '';
    constructor(
        private activateRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private router: Router,
        private alertController: AlertController,
        private ref: ChangeDetectorRef
    ) {
        this.activateRoute.queryParams.pipe(take(1))
            .subscribe(async params => {
                this.joinLink = params?.link;
                if (!this.joinLink) {
                    const alert = await this.alertController.create({
                        header: 'Error!',
                        message: 'Invalid URL is entered',
                        buttons: ['OK'],
                    });

                    await alert.present();
                    this.back();
                }
            });
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.ref.detach();
    }

    getUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.joinLink);
    }

    back() {
        this.router.navigate(['/']);
    }
}
