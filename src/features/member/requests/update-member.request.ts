import { IsString } from "class-validator";
import { CreateMemberRequest } from "./create-member.request";

export type UpdateMemberRequest = Partial<CreateMemberRequest>;