import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patients.interface';

@Injectable()
export class PatientsService {
  constructor(@InjectModel('testdb1') private patientModel: Model<Patient>) {}

  async create(patientData: Patient): Promise<Patient> {
    const createdPatient = new this.patientModel(patientData);
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findByBloodGroup(height: string): Promise<Patient[]> {
    const patientData = await this.patientModel.find({ height }).exec();
    console.log("patientData:", patientData)
    return patientData;
  }
}
// import { Injectable } from '@nestjs/common';
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';

// @Injectable()
// export class PatientsService {
//   constructor(@InjectConnection() private readonly connection: Connection) {}

//   async encryptExistingData() {
//     const collection = this.connection.collection('testdb1');
//     const documents = await collection.find().toArray();

//     for (const doc of documents) {
//       await collection.replaceOne({ _id: doc._id }, doc);
//       console.log(`Encrypted document with _id: ${doc._id}`);
//     }
//   }

//   async findEncrypted(query: object) {
//     const collection = this.connection.collection('testdb1');
//     return await collection.find(query).toArray();
//   }
// }
