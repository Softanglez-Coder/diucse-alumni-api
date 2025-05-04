import { Controller, Get } from '@nestjs/common';
import { CoreService } from './core.service';
import { APIHealth } from './models';

@Controller()
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('health')
  getHealth(): APIHealth {
    const result = this.coreService.getHealth();
    return result;
  }
}
