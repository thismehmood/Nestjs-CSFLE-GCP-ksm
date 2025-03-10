import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongodb from 'mongodb';

@Injectable()
export class PatientsService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private getClientEncryption() {
    const kmsProviders = {
      gcp: {
        email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
        privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    };

    return new mongodb.ClientEncryption(this.connection.getClient(), {
      keyVaultNamespace: 'encryption.__keyVault',
      kmsProviders,
    });
  }


  async queryDecrypted(filter: Record<string, any>) {
    const clientEncryption = this.getClientEncryption();
    const keyId = new mongodb.Binary(Buffer.from(process.env.DATA_KEY_ID, 'base64'), 4);

    const encryptedFilter: Record<string, any> = {};
    if (filter.bloodGroup) {
      encryptedFilter.bloodGroup = await clientEncryption.encrypt(filter.bloodGroup, {
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
        keyId,
      });
    }

    const collection = this.connection.collection('testdb1');
    const encryptedDocuments = await collection.find(encryptedFilter).toArray();

    const decryptedDocuments = [];
    for (const doc of encryptedDocuments) {
      const decryptedDoc = { ...doc };

      if (decryptedDoc.bloodGroup) {
        decryptedDoc.bloodGroup = await clientEncryption.decrypt(decryptedDoc.bloodGroup);
      }
      if (decryptedDoc.ethnicity) {
        decryptedDoc.ethnicity = await clientEncryption.decrypt(decryptedDoc.ethnicity);
      }
      if (decryptedDoc.overallHealth) {
        decryptedDoc.overallHealth = await clientEncryption.decrypt(decryptedDoc.overallHealth);
      }

      decryptedDocuments.push(decryptedDoc);
    }

    return decryptedDocuments;
  }
}

