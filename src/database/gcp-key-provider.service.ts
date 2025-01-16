import { Injectable } from '@nestjs/common';
import { KeyManagementServiceClient } from '@google-cloud/kms';

@Injectable()
export class GcpKeyProviderService {
  private kmsClient: KeyManagementServiceClient;
  private keyName: string;

  constructor() {
    this.kmsClient = new KeyManagementServiceClient();
    this.keyName = process.env.GCP_KEY_NAME;
  }

  async encryptKey(key: Buffer): Promise<Buffer> {
    const [result] = await this.kmsClient.encrypt({
      name: this.keyName,
      plaintext: key.toString('base64'),
    });
    console.log("Buffer.from(result.ciphertext as string, 'base64')",Buffer.from(result.ciphertext as string, 'base64'));
    return Buffer.from(result.ciphertext as string, 'base64');
  }

  async decryptKey(encryptedKey: Buffer): Promise<Buffer> {
    const [result] = await this.kmsClient.decrypt({
      name: this.keyName,
      ciphertext: encryptedKey.toString('base64'),
    });
    return Buffer.from(result.plaintext as string, 'base64');
  }
}
