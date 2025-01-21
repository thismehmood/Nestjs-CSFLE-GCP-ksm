import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createEncryptedMongoClient } from './mongo-encryption.config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const client = await createEncryptedMongoClient();
        return {
          uri: process.env.MONGO_URI,
          connectionFactory: (connection) => {
            connection.client = client;
            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}