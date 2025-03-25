import { Controller, Get } from '@nestjs/common';
import { APIHealth } from './models';
import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('health')
  getHealth(): APIHealth {
    const result = this.coreService.getHealth();
    return result;
  }
}
