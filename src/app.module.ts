import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [DatabaseModule, PatientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}