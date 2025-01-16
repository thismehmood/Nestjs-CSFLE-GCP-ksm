import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createKeyVault } from './database/create-key-vault';
import { encryptExistingData } from './database/encrypt-existing-data';

async function bootstrap() {
  try {
    console.log('Creating Key Vault...');
    await createKeyVault();
    console.log('Key Vault created successfully.');

    console.log('Encrypting existing data...');
    await encryptExistingData();
    console.log('Existing data encrypted successfully.');

    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on port ${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}
bootstrap();
