import * as mongodb from 'mongodb';
import * as fs from 'fs';

export async function createKeyVault() {
  const uri = process.env.MONGO_URI;
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  const keyVaultNamespace = 'encryption.__keyVault';
  const keyVault = client.db('encryption').collection('__keyVault');

  const existingKey = await keyVault.findOne();
  if (existingKey) {
    console.log('Key vault already exists. Skipping key creation.');
    await client.close();
    return;
  }

  const kmsProviders = {
    gcp: {
      email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  };

  const clientEncryption = new mongodb.ClientEncryption(client, {
    keyVaultNamespace,
    kmsProviders,
  });

  const dataKey = await clientEncryption.createDataKey('gcp', {
    masterKey: {
      projectId: 'resounding-axe-439817-e2',
      location: 'global',
      keyRing: 'bmd-kms-testing',
      keyName: 'test-key',
    },
  });

  const keyIdBase64 = dataKey.toString('base64');
  console.log('Data encryption key created:', keyIdBase64);

  // Save the keyId to .env or a local configuration file
  console.log("fs.appendFileSync('.env', `\nDATA_KEY_ID=${keyIdBase64}\n`)fs.appendFileSync('.env', `\nDATA_KEY_ID=${keyIdBase64}\n`)fs.appendFileSync('.env', `\nDATA_KEY_ID=${keyIdBase64}\n`)", fs.appendFileSync('.env', `\nDATA_KEY_ID=${keyIdBase64}\n`))
  fs.appendFileSync('.env', `\nDATA_KEY_ID=${keyIdBase64}\n`);
  await client.close();
}