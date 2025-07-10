import { IBaseType } from "./base";
import { ITag } from "./tag";

export interface IAdvocate extends IBaseType {
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    yearsOfExperience: number;
    phoneNumber: string;
    tags: ITag[];
};
