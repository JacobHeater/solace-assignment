import { IBaseType } from "./base";

export interface ITag extends IBaseType {
    title: string;
    description: string;
    tagType: TagType;
}

export enum TagType {
    Specialty = 'Specialty'
};