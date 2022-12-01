import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FileDownloadService } from '../services/file-download.service';

enum AllowedMethodsTypes {
  iFrame = 'iframe',
  inappbrowser = 'iab'
}
declare let cordova;
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
    private iab: InAppBrowser,
    private androidPermissions: AndroidPermissions,
    private fileDownloadService: FileDownloadService
  ) { }

  initPermissions() {
    const permissionsList = [
      this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.CAMERA
    ];
    permissionsList.forEach(p => {
      this.androidPermissions.checkPermission(p)
        .then(
          result => {
            console.log(p, 'has permission?', JSON.stringify(result));
            if (!result.hasPermission) {
              throw result.hasPermission;
            }
          },
          err => this.requestPermission(p)
        )
        .catch(err => this.requestPermission(p));
    });
  }

  requestPermission(permission) {
    this.androidPermissions.requestPermission(permission)
      .then(event => this.permissionSuccess(event))
      .catch(error => this.permissionError(error));

  }
  permissionSuccess(event) {
    console.log('Permission successfully provided', JSON.stringify(event));
  }

  permissionError(error) {
    console.log('Permission failed to provide', JSON.stringify(error));
  }

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

    browser.on('loadstart').subscribe(event => {
      console.log('In app browser loaded');
      this.initPermissions();
    });
    browser.on('loadstop').subscribe(event => {
      console.log('In app browser loaded');
      this.initPermissions();
    });

    browser.on('message').subscribe((eventData: any) => {
      // you will get the file eventData here
      console.log('In app browser new message', JSON.stringify(eventData));

      if (eventData?.data?.type === 'file_download') {
        eventData = eventData.data;
        console.log('File recieved, attempting to downloading file');
        this.fileDownloadService.downloadFile(eventData.fileData, eventData.fileName);
      }
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
