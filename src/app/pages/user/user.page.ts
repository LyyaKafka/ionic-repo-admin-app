import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/auth.service';
import { User, Document } from 'src/app/shared/storage-prop';
import { StorageService } from 'src/app/shared/storage.service';
import { ModalPage } from './modal/modal.page';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  adminData: User;

  usersData: User[] = new Array<User>;
  usersShowData: User[];

  arrayKeyData: Array<string> = [];
  filteredArrayKeyData: Array<string> = [];

  itemPerPage: number = 20;
  maxPageOnItem: number;
  currPage: number = 1;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private modalController: ModalController,
  ) {}

  ionViewWillEnter(){
    this.usersData = [];
    this.setAll();
  }

  ngOnInit() {
  }

  async openDetail(user: User) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        user: user
      },
      cssClass: 'my-custom-class'
    });
    modal.present();
  }

  handleRefresh(event: any){
    setTimeout(() => {
      this.usersData = [];
      this.setAll();
      event.target.complete();
    }, 2000);
  }


  // --------------------------

  get atFirstPage(){
    return this.currPage === 1;
  }

  get atLastPage(){
    return this.currPage === this.maxPageOnItem;
  }

  async prevPage(){
    if(this.currPage > 1){
      this.currPage--;
    }else{
      this.currPage = 1;
    }

    this.renderPage();
  }

  async nextPage(){
    if(this.currPage < this.maxPageOnItem){
      this.currPage++;
    }else{
      this.currPage = this.maxPageOnItem;
    }

    this.renderPage();
  }

  async searchQuery(event: any){
    let searchKey:string = event.target.value;
    console.log(searchKey);

    let expr = new RegExp(searchKey, "gi");
    this.filteredArrayKeyData = this.arrayKeyData.filter((elem, index)=> expr.test(elem));

    console.log(this.filteredArrayKeyData);

    this.renderPage();
  }


  setAll(){
    this.storageService.getUsers().then((res) => {
      res.docs.map((user) => {

        let tempuser: User = {
          uid: user.id,
          username: user.get('username'),
          email: user.get('email')
        };

        this.usersData.push(tempuser);
        // this.mapAllData.set(doc.get('title'), tempdoc);
        this.arrayKeyData.push(user.get("username"));
      })

      this.filteredArrayKeyData = null;
      // this.usersShowData = this.usersData;

      //set maxpage
      const totalItem = this.usersData.length;
      this.maxPageOnItem = Math.ceil(totalItem/this.itemPerPage);

      // console.log(this.usersData)
      // console.log(this.mapAllData);
      // console.log(this.arrayKeyData);
      console.log(this.filteredArrayKeyData);
    }).then(() => {
      this.renderPage();
    });
  }


  renderPage() {
    this.usersShowData = this.usersData;

    console.log("---------------------");
    console.log("curr page : " + this.currPage);
    console.log("item Per Page : " + this.itemPerPage);
    console.log("total data : " + this.usersData.length);
    console.log("max page : " + this.maxPageOnItem);

    if (this.filteredArrayKeyData !== null){
      this.usersShowData = this.usersShowData
      .filter(user => this.filteredArrayKeyData.includes(user.username));

      console.log("filtered", this.usersShowData);
    }

    let sliceIndex: number = (this.currPage-1)*this.itemPerPage;

    this.usersShowData = this.usersShowData
    .slice(sliceIndex, sliceIndex + this.itemPerPage);
    console.log("sliced", sliceIndex, sliceIndex + this.itemPerPage);
    console.log("sliced", this.usersShowData);

    console.log("######## trigger render");
  }

  logout(){
    this.authService.logout();
  }
}
