import * as mongodb from 'mongodb';

export async function encryptExistingData() {
  const uri = process.env.MONGO_URI;

  const regularClient = new mongodb.MongoClient(uri);
  await regularClient.connect();
  const db = regularClient.db('testdb1');
  const collection = db.collection('testdb1');
  
  const documents = await collection.find().toArray();
  console.log(`Fetched ${documents.length} documents for encryption.`);
  await collection.deleteMany({});



  const encryptedClient = new mongodb.MongoClient(uri);
  await encryptedClient.connect();

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

  let keyId: mongodb.Binary;
  try {
    keyId = new mongodb.Binary(Buffer.from(process.env.DATA_KEY_ID, 'base64'), 4);
  } catch (error) {
    console.error('Invalid DATA_KEY_ID format:', error.message);
    throw new Error('Failed to create keyId from DATA_KEY_ID. Ensure it is a valid Base64 string.');
  }

  const encryptedDb = encryptedClient.db('testdb1');
  const encryptedCollection = encryptedDb.collection('testdb1');

  function isEncrypted(field: any): boolean {
    return field instanceof mongodb.Binary && field.sub_type === 6;
  }

  for (const doc of documents) {
    try {
      if (doc.bloodGroup && !isEncrypted(doc.bloodGroup)) {
        doc.bloodGroup = await clientEncryption.encrypt(doc.bloodGroup, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
          keyId,
        });
      }
      if (doc.ethnicity && !isEncrypted(doc.ethnicity)) {
        doc.ethnicity = await clientEncryption.encrypt(doc.ethnicity, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
          keyId,
        });
      }

      if (doc.overallHealth && !isEncrypted(doc.overallHealth)) {
        doc.overallHealth = await clientEncryption.encrypt(doc.overallHealth, {
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
          keyId,
        });
      }

      if (doc.healthProblems) {
        doc.healthProblems = await Promise.all(
          doc.healthProblems.map(async (problem: string) =>
            isEncrypted(problem)
              ? problem
              : clientEncryption.encrypt(problem, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
                  keyId,
                })
          )
        );
      }

      if (doc.familyHistory) {
        doc.familyHistory = await Promise.all(
          doc.familyHistory.map(async (history: string) =>
            isEncrypted(history)
              ? history
              : clientEncryption.encrypt(history, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
                  keyId,
                })
          )
        );
      }

      if (doc.medications) {
        doc.medications = await Promise.all(
          doc.medications.map(async (medication: any) => ({
            name: isEncrypted(medication.name)
              ? medication.name
              : await clientEncryption.encrypt(medication.name, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                  keyId,
                }),
            dosage: isEncrypted(medication.dosage)
              ? medication.dosage
              : await clientEncryption.encrypt(medication.dosage, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                  keyId,
                }),
            status: medication.status,
          }))
        );
      }

      if (doc.allergies) {
        doc.allergies = await Promise.all(
          doc.allergies.map(async (allergy: any) => ({
            allergicTo: isEncrypted(allergy.allergicTo)
              ? allergy.allergicTo
              : await clientEncryption.encrypt(allergy.allergicTo, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                  keyId,
                }),
            reaction: isEncrypted(allergy.reaction)
              ? allergy.reaction
              : await clientEncryption.encrypt(allergy.reaction, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
                  keyId,
                }),
            stillAllergic: allergy.stillAllergic,
          }))
        );
      }

      if (doc.otherFamilyHistories) {
        doc.otherFamilyHistories = await Promise.all(
          doc.otherFamilyHistories.map(async (history: any) => ({
            relationship: isEncrypted(history.relationship)
              ? history.relationship
              : await clientEncryption.encrypt(history.relationship, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                  keyId,
                }),
            description: isEncrypted(history.description)
              ? history.description
              : await clientEncryption.encrypt(history.description, {
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
                  keyId,
                }),
          }))
        );
      }

      await encryptedCollection.insertOne(doc);
      console.log(`Encrypted document with _id: ${doc._id}`);
    } catch (error) {
      console.error(`Error encrypting document with _id: ${doc._id}:`, error.message);
    }
  }

  await regularClient.close();
  await encryptedClient.close();

  console.log('Encryption of existing data completed.');
}
