import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  documentId,
  setDoc,
  getDocs,
  query,
  where,
  getCountFromServer,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

import { User, Document } from './storage-prop';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // USER
  async getUserById(uid: string) {
    const userDocRef = await doc(this.firestore, `users/${uid}`);
    return docData(userDocRef, { idField: 'uid' }) as Observable<User>;
  }

  async getUsers() {
    const q = query(collection(this.firestore, 'users'));
    const snapshot = await getDocs(q);
    return snapshot;
  }

  async getUserDocumentsCount(uid: string) {
    const userDocRef = collection(this.firestore, `users/${uid}/userdoc`);
    const snapshot = await getDocs(userDocRef);
    const docCount = snapshot.size;

    return docCount ? docCount : 0;
  }

  async findAdminById(uid: string) {
    const q = query(
      collection(this.firestore, 'admins'),
      where('userid', '==', uid)
    );
    const snapshot = await getDocs(q);
    return snapshot;
  }

  async getAdminIds() {
    const q = query(collection(this.firestore, 'admins'));
    const snapshot = await getDocs(q);
    return snapshot;
  }

  // DOCUMENT
  async getDocumentById(id: string) {
    const docRef = await doc(this.firestore, `documents/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Document>;
  }

  async getDocuments() {
    const q = query(collection(this.firestore, 'documents'));
    const snapshot = await getDocs(q);
    return snapshot;
  }

  deleteDocument(docId: string) {
    const docRef = doc(this.firestore, `documents/${docId}`);
    return deleteDoc(docRef);
  }
}
