import { Controller, Get, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('search')
  async searchEncrypted(@Query() query: Record<string, string>) {
    const result = await this.patientsService.queryEncrypted(query);
    return result;
  }
}
