// src/firebase/firebase.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '../config/firebase.config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    try {
      if (!admin.apps.length) {
        // Firebase 설정 검증
        if (
          !firebaseConfig.projectId ||
          !firebaseConfig.privateKey ||
          !firebaseConfig.clientEmail
        ) {
          console.error('❌ Firebase configuration is missing required fields');
          console.error('Required: projectId, privateKey, clientEmail');
          console.error('Current config:', {
            projectId: firebaseConfig.projectId || 'MISSING',
            privateKey: firebaseConfig.privateKey ? 'SET' : 'MISSING',
            clientEmail: firebaseConfig.clientEmail || 'MISSING',
          });
          throw new Error('Firebase configuration is incomplete');
        }

        this.app = admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
        });
        console.log('🔥 Firebase Admin Initialized successfully');
        console.log('📁 Project ID:', firebaseConfig.projectId);
      }
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin:', error);
      throw error;
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
