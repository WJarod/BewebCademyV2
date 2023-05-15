import IBadgesModel from "./IBadgesModel";
import IExerciceModel from "./IExerciceModel";
import IUserModel from "./IUserModel";

export default interface ISessionModel {
  _id: string;
  badges: IBadgesModel[];
  exercices: IExerciceModel[];
  user: IUserModel;
}