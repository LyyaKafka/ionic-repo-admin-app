import { Component, Input, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { StorageService } from 'src/app/shared/storage.service';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { User } from 'src/app/shared/storage-prop';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() user: User;
  userDocumentCount: Number;

  // download link in html
  downloadLink: any;
  filename: any;

  constructor(
    private modalController: ModalController,
    // private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.storageService
      .getUserDocumentsCount(this.user.uid)
      .then((res) => (this.userDocumentCount = res));
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
