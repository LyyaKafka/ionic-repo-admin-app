import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const result = await this.authService.login(this.credentials.value);

    let AdminIds: string[] = [];
    result[1].docs.map((id) => {
      AdminIds.push(id.get('userid'));
    });

    await loading.dismiss();

    console.log(this.authService.currentUserId == AdminIds[0]);

    if (this.authService.currentUserId === AdminIds[0]) {
      this.authService.startUserLocalStorage();
      this.router.navigateByUrl('/document', { replaceUrl: true });
    } else if (this.authService.currentUserId) {
      this.authService.immediateSignOut();
      localStorage.clear();
      this.showAlert('Login failed', 'Please try again!');
    } else {
      localStorage.clear();
      this.showAlert('Login failed', 'Please try again!');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
