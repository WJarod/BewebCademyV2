import ILanguageModel from "./ILanguageModel";

export default interface IBadgesModel {
  _id: string;
  name: string;
  language: ILanguageModel[];
  image: string;
  acquisition_date: Date;
  all_done: Boolean;
}
