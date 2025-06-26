import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Global()
@Module({
  providers: [
    {
      provide: 'FIRESTORE',
      useFactory: () => {
        const serviceAccount = require(
          path.resolve(__dirname, '../../firebase-service-account.json'),
        );

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        return admin.firestore();
      },
    },
  ],
  exports: ['FIRESTORE'],
})
export class FirebaseModule {}
