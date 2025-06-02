import { Role } from "@core";

export class MemberEntity {
    id: string;
    email: string;
    blocked: boolean;
    roles: Role[];
}