import { Injectable } from '@nestjs/common';
import { APIHealth } from './models';

@Injectable()
export class CoreService {
    getHealth(): APIHealth {
        const response = new APIHealth('Up and running');
        return response;
    }
}
