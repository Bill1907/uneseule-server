// src/firebase/firebase.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '../config/firebase.config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
      console.log('🔥 Firebase Admin Initialized');
    }
  }

  // Firestore 인스턴스를 반환하는 메소드
  getFirestoreInstance(): admin.firestore.Firestore {
    return admin.firestore(this.app);
  }

  // 👇 Auth 인스턴스를 반환하는 메소드 추가
  getAuthInstance(): admin.auth.Auth {
    return admin.auth(this.app);
  }
}
