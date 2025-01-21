import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientSchema } from './patients.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'testdb1', schema: PatientSchema }])],
  controllers: [PatientsController],
  providers: [PatientsService],
  // exports: [PatientsService],
})
export class PatientsModule {}
