import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private dummyLink = 'https://test-dev.almeda.de/a/09882ce9-a24b-4015-be6c-a946b30f5085';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  joinInputCtrl = new FormControl(this.dummyLink, urlValidator());

  constructor(
    private router: Router
  ) { }

  joinLink() {
    this.router.navigate(['/appointment'], {
      queryParams: {
        link: this.joinInputCtrl.value
      }
    });
  }

  clear() {
    this.joinInputCtrl.reset();
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
