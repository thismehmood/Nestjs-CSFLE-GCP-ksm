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
  const keyId = process.env.DATA_KEY_ID;

  const encryptedFieldsMap = {
    'testdb1.testdb1': {
      fields: [
        { path: 'bloodGroup', bsonType: 'string', keyId, queries: true },
        { path: 'ethnicity', bsonType: 'string', keyId },
        { path: 'overallHealth', bsonType: 'string', keyId },
        { path: 'healthProblems', bsonType: 'array', keyId },
        { path: 'familyHistory', bsonType: 'array', keyId },
        { path: 'medications.name', bsonType: 'string', keyId, queries: true },
        { path: 'medications.dosage', bsonType: 'string', keyId },
        { path: 'allergies.allergicTo', bsonType: 'string', keyId, queries: true },
        { path: 'allergies.reaction', bsonType: 'string', keyId },
        // `stillAllergic` is a boolean, and encryption is not required for booleans
        { path: 'otherFamilyHistories.relationship', bsonType: 'string', keyId },
        { path: 'otherFamilyHistories.description', bsonType: 'string', keyId },
      ],
    },
  };
console.log("encryptedFieldsMapencryptedFieldsMapencryptedFieldsMapencryptedFieldsMapencryptedFieldsMap9-???>>>>>>????::::", encryptedFieldsMap['testdb1.testdb1'])
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