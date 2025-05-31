import { Role } from "@core";

export class CreateUserResponse {
    id: string;
    name: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    isActive: boolean;
    roles: Role[];
}