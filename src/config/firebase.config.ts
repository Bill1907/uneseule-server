import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';

export const firebaseConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'uneseule-ai',
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  clientEmail:
    process.env.FIREBASE_CLIENT_EMAIL ||
    'firebase-adminsdk-fbsvc@uneseule-ai.iam.gserviceaccount.com',
};

// export const initializeFirebase = () => {
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert(firebaseConfig),
//     });
//   }
//   return admin;
// };
