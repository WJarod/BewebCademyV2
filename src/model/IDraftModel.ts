import IUserModel from "./IUserModel";

export default interface IDraftModel {
  _id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  pre_select: IUserModel[];
  select: IUserModel[];
}