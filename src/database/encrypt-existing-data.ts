import * as mongodb from 'mongodb';

export async function encryptExistingData() {
  const uri = process.env.MONGO_URI;

  const regularClient = new mongodb.MongoClient(uri);
  await regularClient.connect();
  const db = regularClient.db('testdb1');
  const collection = db.collection('testdb1');

  // Fetch all existing documents
  const documents = await collection.find().toArray();
  console.log(`Fetched ${documents.length} documents for encryption.`);

  // Connect to the encrypted client
  const encryptedClient = new mongodb.MongoClient(uri);
  await encryptedClient.connect();

  // Setup ClientEncryption
  const kmsProviders = {
    gcp: {
      email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  };
  const keyVaultNamespace = 'encryption.__keyVault';
  const clientEncryption = new mongodb.ClientEncryption(encryptedClient, {
    keyVaultNamespace,
    kmsProviders,
  }); 

  const keyId = new mongodb.Binary(Buffer.from(process.env.DATA_KEY_ID, 'base64'), 4);

  // Get the collection for encrypted data
  const encryptedDb = encryptedClient.db('testdb1');
  const encryptedCollection = encryptedDb.collection('testdb1');

  // Clear old unencrypted data in the encrypted collection
  await encryptedCollection.deleteMany({});


  // Encrypt and insert each document
  for (const doc of documents) {
    doc.bloodGroup = await clientEncryption.encrypt(doc.bloodGroup, {
      algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
      keyId,
    });
    doc.ethnicity = await clientEncryption.encrypt(doc.ethnicity, {
      algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
      keyId,
    });
    doc.overallHealth = await clientEncryption.encrypt(doc.overallHealth, {
      algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
      keyId,
    });
    doc.healthProblems = await Promise.all(
      doc.healthProblems.map(async (problem: string) =>
        clientEncryption.encrypt(problem, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
          keyId,
        })
      )
    );
    doc.familyHistory = await Promise.all(
      doc.familyHistory.map(async (history: string) =>
        clientEncryption.encrypt(history, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
          keyId,
        })
      )
    );
    doc.medications = await Promise.all(
      doc.medications.map(async (medication: any) => ({
        name: await clientEncryption.encrypt(medication.name, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
          keyId,
        }),
        dosage: await clientEncryption.encrypt(medication.dosage, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
          keyId,
        }),
        status: medication.status, // Boolean doesn't require encryption
      }))
    );
    doc.allergies = await Promise.all(
      doc.allergies.map(async (allergy: any) => ({
        allergicTo: await clientEncryption.encrypt(allergy.allergicTo, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
          keyId,
        }),
        reaction: await clientEncryption.encrypt(allergy.reaction, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
          keyId,
        }),
        stillAllergic: allergy.stillAllergic, // Boolean doesn't require encryption
      }))
    );
    doc.otherFamilyHistories = await Promise.all(
      doc.otherFamilyHistories.map(async (history: any) => ({
        relationship: await clientEncryption.encrypt(history.relationship, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
          keyId,
        }),
        description: await clientEncryption.encrypt(history.description, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
          keyId,
        }),
      }))
    );

    await encryptedCollection.insertOne(doc);
    console.log(`Encrypted document with _id: ${doc._id}`);
  }

  await regularClient.close();
  await encryptedClient.close();

  console.log('Encryption of existing data completed.');
}
