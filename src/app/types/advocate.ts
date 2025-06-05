import { IBaseType } from "./base";
import { ISpecialty } from "./specialty";

export interface IAdvocate extends IBaseType {
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    yearsOfExperience: number;
    phoneNumber: string;
    specialties: ISpecialty[];
};
