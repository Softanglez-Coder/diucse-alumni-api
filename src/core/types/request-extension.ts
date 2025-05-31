import { Request } from "express";
import { UserEntity } from "@user";

export interface RequestExtension extends Request {
    user?: UserEntity;
}