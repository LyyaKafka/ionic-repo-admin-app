import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from './storage-prop';
import { StorageService } from './storage.service';

import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private alertController: AlertController,
    private auth: Auth,
    private storageService: StorageService
  ) {}

  get currentUserId() {
    try {
      return this.auth.currentUser?.uid;
    } catch (error) {
      console.log('Something went wrong current user', Error);
      return null;
    }
  }

  startUserLocalStorage() {
    this.storageService.getUserById(this.currentUserId).then((res) => {
      res.subscribe((res) => {
        localStorage.setItem('CurrentUserUID', res.uid);
        localStorage.setItem('CurrentUsername', res.username);
        localStorage.setItem('CurrentUserEmail', res.email);
      });
    });
  }

  getUserLocalStorage(): User {
    let user: User;
    try {
      user = {
        uid: localStorage.getItem('CurrentUserUID'),
        username: localStorage.getItem('CurrentUsername'),
        email: localStorage.getItem('CurrentUserEmail'),
      };
    } catch (error) {
      localStorage.removeItem('CurrentUserUID');
      localStorage.removeItem('CurrentUsername');
      localStorage.removeItem('CurrentUserEmail');
      this.startUserLocalStorage();
      return this.getUserLocalStorage();
    }
    return user;
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Are You Sure ?',
      buttons: [
        {
          text: 'Yes',
          role: 'true',
        },
        {
          text: 'No',
          role: 'false',
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss().then(async ({ role }) => {
      if (role === 'true') {
        await signOut(this.auth).then(() => {
          console.log(`${this.auth.currentUser?.email} is logged out`);
          localStorage.clear();
          this.router.navigateByUrl('/sign-in', { replaceUrl: true });
        });
      }
    });
  }

  async immediateSignOut() {
    await signOut(this.auth).then(() => {
      localStorage.clear();
      this.router.navigateByUrl('/sign-in', { replaceUrl: true });
    });
  }

  async login({ email, password }: any) {
    try {
      const result = Promise.all([
        await signInWithEmailAndPassword(this.auth, email, password).catch(
          (Error) => {
            console.log('Something went wrong with sign up: ', Error);
          }
        ),
        await this.storageService.getAdminIds(),
      ]);

      return result;
    } catch (e) {
      return null;
    }
  }
}
