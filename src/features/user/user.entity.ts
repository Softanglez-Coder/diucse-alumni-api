import { Role } from "@core";

export interface UserEntity {
    id: string;
    username: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    hash: string;
    isActive: boolean;
    roles: Role[];
}