import { Schema } from 'mongoose';

export const PatientSchema = new Schema({
  name: { type: String, required: true },
  medicalRecord: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  disease: { type: String, required: true },
});
