import IBadgesModel from "./IBadgesModel";

export default interface IExerciceModel {
  _id: string;
  badges: IBadgesModel;
  name: string;
  done: Boolean;
  done_date: Date;
  statement: string;
  result: String;
  help: String;
}
