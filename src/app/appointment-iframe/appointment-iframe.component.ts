import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-appointment-iframe',
    templateUrl: 'appointment-iframe.component.html',
    styleUrls: ['appointment-iframe.component.scss']
})

export class AppointmentIFramePage implements OnInit, AfterViewInit {
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
        // Disable changeDetection to aviod unnecessary reloading of the iFrame
        this.ref.detach();
    }

    getUrl() {
        // Sanitize the URL to allow
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.joinLink);
    }

    back() {
        this.router.navigate(['/']);
    }
}
