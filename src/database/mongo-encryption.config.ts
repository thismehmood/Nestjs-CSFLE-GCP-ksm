// import * as mongodb from 'mongodb';

// export async function createEncryptedMongoClient() {
//   const pemKey = process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
//   const base64Key = Buffer.from(pemKey, 'utf-8').toString('base64');

//   const kmsProviders = {
//     gcp: {
//       email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
//       privateKey: base64Key,
//     },
//   };
  
//   const keyVaultNamespace = 'encryption.__keyVault';
//   const encryptedFieldsMap = {
//     'testdb1.testdb1': {
//       fields: [
//         { path: 'bloodGroup', bsonType: 'string', keyId: new mongodb.Binary(Buffer.alloc(0), 4), queries: true },
//         { path: 'ethnicity', bsonType: 'string', keyId: new mongodb.Binary(Buffer.alloc(0), 4), queries: true },
//         { path: 'overallHealth', bsonType: 'string', keyId: new mongodb.Binary(Buffer.alloc(0), 4) },
//         { path: 'medications.name', bsonType: 'string', keyId: new mongodb.Binary(Buffer.alloc(0), 4) },
//         { path: 'allergies.allergicTo', bsonType: 'string', keyId: new mongodb.Binary(Buffer.alloc(0), 4) },
//         { path: 'familyHistory', bsonType: 'array', keyId: new mongodb.Binary(Buffer.alloc(0), 4) },
//         { path: 'healthProblems', bsonType: 'array', keyId: new mongodb.Binary(Buffer.alloc(0), 4) },
//       ],
//     },
//   };

//   // async function createDataKey() {
//   //   const client = new mongodb.MongoClient(process.env.MONGO_URI);
//   //   await client.connect();
  
//   //   const encryption = new mongodb.ClientEncryption(client, {
//   //     keyVaultNamespace: 'encryption.__keyVault',
//   //     kmsProviders: {
//   //       gcp: {
//   //         email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
//   //         privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   //       },
//   //     },
//   //   });
//   // l
//   //   const keyId = await encryption.createDataKey('gcp');
//   //   console.log('Data key created:', keyId);
//   //   return keyId;
//   // }
//   console.log("encryptedFieldsMap:", encryptedFieldsMap['testdb1.testdb1']);
//   const client = new mongodb.MongoClient(process.env.MONGO_URI, {
//     autoEncryption: {
//       keyVaultNamespace,
//       kmsProviders,
//       encryptedFieldsMap,
//       extraOptions: {
//         mongocryptdSpawnPath: '/usr/local/bin/mongocryptd',
//         mongocryptdBypassSpawn: false,
//       },
//     },
//   });

//   await client.connect();
//   console.log('Connected to MongoDB with encryption enabled.');
//   return client;
// }



// import * as mongodb from 'mongodb';

// export async function createEncryptedMongoClient() {
//   const pemKey = process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
//   const base64Key = Buffer.from(pemKey, 'utf-8').toString('base64');

//   const kmsProviders = {
//     gcp: {
//       email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
//       privateKey: base64Key,
//     },
//   };

//   const keyVaultNamespace = 'encryption.__keyVault';

//   const encryptedFieldsMap = {
//     'testdb1.testdb1': {
//       fields: [
//         { path: 'bloodGroup', bsonType: 'string', queries: true },
//         { path: 'ethnicity', bsonType: 'string', queries: true },
//         { path: 'overallHealth', bsonType: 'string' },
//         { path: 'healthProblems', bsonType: 'array' },
//         { path: 'familyHistory', bsonType: 'array' },
//       ],
//     },
//   };

//   const client = new mongodb.MongoClient(process.env.MONGO_URI, {
//     autoEncryption: {
//       keyVaultNamespace,
//       kmsProviders,
//       encryptedFieldsMap,
//       extraOptions: {
//         mongocryptdSpawnPath: '/usr/local/bin/mongocryptd',
//       },
//     },
//   });

//   await client.connect();
//   console.log('Connected to MongoDB with encryption enabled.');
//   return client;
// }

// import * as mongodb from 'mongodb';

// export async function createEncryptedMongoClient() {
//   const kmsProviders = {
//     gcp: {
//       email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
//       privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     },
//   };

//   const keyVaultNamespace = 'encryption.__keyVault';

//   const encryptedFieldsMap = {
//     'testdb1.patients': {
//       fields: [
//         { path: 'bloodGroup', bsonType: 'string', queries: true },
//         { path: 'ethnicity', bsonType: 'string' },
//         { path: 'overallHealth', bsonType: 'string' },
//       ],
//     },
//   };

//   const client = new mongodb.MongoClient(process.env.MONGO_URI, {
//     autoEncryption: {
//       keyVaultNamespace,
//       kmsProviders,
//       encryptedFieldsMap,
//       extraOptions: {
//         mongocryptdSpawnPath: '/usr/local/bin/mongocryptd',
//         mongocryptdBypassSpawn: false,
//       },
//     },
//   });

//   await client.connect();
//   console.log('Connected to MongoDB with CSFLE enabled.');
//   return client;
// }

// import * as mongodb from 'mongodb';

// export async function createEncryptedMongoClient() {
// const kmsProviders = {
//   gcp: {
//     email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
//     privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY,
//   },
// };
//   const keyVaultNamespace = 'encryption.__keyVault';

//   const encryptedFieldsMap = {
//     'testdb1.testdb1': {
//       fields: [
//         { path: 'bloodGroup', bsonType: 'string', queries: true },
//         { path: 'ethnicity', bsonType: 'string' },
//         { path: 'overallHealth', bsonType: 'string' },
//       ],
//     },
//   };
// console.log("encryptedFieldsMapencryptedFieldsMapencryptedFieldsMapencryptedFieldsMapencryptedFieldsMap",encryptedFieldsMap);
//   const client = new mongodb.MongoClient(process.env.MONGO_URI, {
//     autoEncryption: {
//       keyVaultNamespace,
//       kmsProviders,
//       encryptedFieldsMap,
//       extraOptions: {
//         mongocryptdSpawnPath: '/usr/local/bin/mongocryptd',
//         mongocryptdBypassSpawn: false,
//       },
//     },
//   });

//   await client.connect();
//   console.log('Connected to MongoDB with CSFLE enabled.');
//   console.log("clientclientclientclientclientclient",client);
//   return client;
// }


import * as mongodb from 'mongodb';

export async function createEncryptedMongoClient() {
  const kmsProviders = {
    gcp: {
      email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  };

  const keyVaultNamespace = 'encryption.__keyVault';

  // Use the keyId from .env
  const keyId = new mongodb.Binary(Buffer.from(process.env.DATA_KEY_ID, 'base64'), 4);

  const encryptedFieldsMap = {
    'testdb1.testdb1': {
      fields: [
        { path: 'bloodGroup', bsonType: 'string', keyId, queries: true },
        { path: 'ethnicity', bsonType: 'string', keyId },
        { path: 'overallHealth', bsonType: 'string', keyId },
      ],
    },
  };

  const client = new mongodb.MongoClient(process.env.MONGO_URI, {
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders,
      encryptedFieldsMap,
      extraOptions: {
        mongocryptdSpawnPath: '/usr/local/bin/mongocryptd',
        mongocryptdBypassSpawn: false,
      },
    },
  });

  await client.connect();
  console.log('Connected to MongoDB with CSFLE enabled.');
  return client;
}