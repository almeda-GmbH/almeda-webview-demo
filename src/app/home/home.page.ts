import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

enum AllowedMethodsTypes {
  iFrame = 'iframe',
  inappbrowser = 'iab'
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedMethod: AllowedMethodsTypes = AllowedMethodsTypes.iFrame;
  availableMethods = [{
    name: 'iFrame',
    value: AllowedMethodsTypes.iFrame
  },
  {
    name: 'in app browser',
    value: AllowedMethodsTypes.inappbrowser
  }];
  private dummyLink = environment?.dummyLink || 'https://test-dev.almeda.de/a/09882ce9-a24b-4015-be6c-a946b30f5085';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  joinInputCtrl = new FormControl(this.dummyLink, urlValidator());

  constructor(
    private router: Router,
    private iab: InAppBrowser
  ) { }

  joinLink() {
    const url = this.joinInputCtrl.value;

    if (!url) {
      console.error('Failed to start in app browser check URL', url);
      return;
    }

    switch (this.selectedMethod) {
      case AllowedMethodsTypes.inappbrowser:
        this.startAppointmentInAB(url);
        break;
      case AllowedMethodsTypes.iFrame:
        this.router.navigate(['/appointment-iframe'], {
          queryParams: {
            link: url
          }
        });
        break;
      default:
        console.error('Unknown method selected to join Link');
        break;
    }
  }

  clear() {
    this.joinInputCtrl.reset();
  }

  private startAppointmentInAB(url: string) {

    const browser = this.iab.create(url, '_blank', {
      location: 'no',
      hideurlbar: 'yes',
      hidenavigationbuttons: 'yes',
      mediaPlaybackRequiresUserAction: 'no',
      zoom: 'no'
    });


    // browser.close();
  }
}



const urlValidator = (): ValidatorFn => (control: AbstractControl): { [key: string]: string } | null => {
  let value = control.value;

  value = String(value).trim();
  if (/^[(http:\/\/)|(https:\/\/)][\w\W]*$/.test(value)) {
    return null;
  } else {
    return { reason: 'invalid url' };
  }
};
