import { EntityRef } from 'src/common/entity-ref.schema';
import { MembershipStatus } from '../enums/membership-status.enum';

export class MembershipEntity {
    id: string;
    name: string;
    email: string;
    phone: string;

    currentCountry: EntityRef;
    profession: EntityRef;
    institute: EntityRef;
    designation: EntityRef;
    lastAcademicLevel: EntityRef;
    lastPassingYear: EntityRef;
    lastBatch: EntityRef;

    status: MembershipStatus;
    createdAt: Date;
    updatedAt: Date;

    approvedBy?: EntityRef;
    approvedAt?: Date;

    rejectedBy?: EntityRef;
    rejectedAt?: Date;
    reasonOfRejection?: string;
}

