import { Request } from "express";
import { MemberEntity } from "@member";

export interface RequestExtension extends Request {
    member?: MemberEntity;
}