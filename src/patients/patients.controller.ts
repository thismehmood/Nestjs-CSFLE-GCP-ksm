import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './patients.interface';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() patientData: Patient) {
    return this.patientsService.create(patientData);
  }

  @Get()
  async findAll() {
    return this.patientsService.findAll();
  }

  @Get('bloodGroup')
  async findByBloodGroup(@Query('bloodGroup') bloodGroup: string) {
    return this.patientsService.findByBloodGroup(bloodGroup);
  }
}


// import { Controller, Get, Query } from '@nestjs/common';
// import { PatientsService } from './patients.service';

// @Controller('patients')
// export class PatientsController {
//   constructor(private readonly patientsService: PatientsService) {}

//   @Get('encrypt')
//   async encryptExistingData() {
//     await this.patientsService.encryptExistingData();
//     return 'Data encryption completed.';
//   }

//   @Get()
//   async find(@Query('field') field: string, @Query('value') value: string) {
//     const query = { [field]: value };
//     return this.patientsService.findEncrypted(query);
//   }
 
// }
