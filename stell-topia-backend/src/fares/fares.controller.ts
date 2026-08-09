import { Controller, Get, Param, Query } from '@nestjs/common';
import { FaresService } from './fares.service';

@Controller('api/v1/fares')
export class FaresController {
  constructor(private readonly faresService: FaresService) {}

  @Get('search')
  search(@Query() query: Record<string, any>) {
    return this.faresService.search(query);
  }
}
