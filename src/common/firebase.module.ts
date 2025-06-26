import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Global()
@Module({
  providers: [
    {
      provide: 'FIRESTORE',
      useFactory: (configService: ConfigService) => {
        const serviceAccount = JSON.parse(
          Buffer.from(
            configService.get<string>('FIREBASE_KEY_B64')!,
            'base64',
          ).toString('utf-8'),
        );

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        return admin.firestore();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIRESTORE'],
})
export class FirebaseModule {}
