import { Controller, Get, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('search-decrypted')
  async searchDecrypted(@Query() query: Record<string, string>) {
    const result = await this.patientsService.queryDecrypted(query);
    return result;
  }
}
