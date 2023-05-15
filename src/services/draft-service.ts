import axios from "axios";
import IDraftModel from "../model/IDraftModel";
import IUserModel from "../model/IUserModel";

const beforeDraft = axios.create({
  baseURL: "https://beforedraft-service-production.up.railway.app/before-draft",
});

export const getBeforeDrafts = async () => {
  try {
    const data = await beforeDraft.get("/");

    await data.data.map((data: IDraftModel) =>{
        data._id = data._id.toString()
      } )
    return data.data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getBeforeDraftById = async (id: string) => {
  try {
    const data = await beforeDraft.get(`/${id}`);
    return data.data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const createBeforeDraft = async (formData: IDraftModel) => {
  try {
    await beforeDraft.post("/", { formData });

  } catch (error: any) {
    console.log(error.message);
  }
};

export const deleteBeforeDraftById = async (id: string) => {
  try {
    await beforeDraft.delete(`/${id}`);

  } catch (error: any) {
    console.log(error.message);
  }
};

export const updateBeforeDraft = async (id: string, formData: IDraftModel) => {
  console.log(formData)
  try {
    await beforeDraft.put(`/${id}`, {formData} );
  } catch (error: any) {
    console.log(error.message);
  }
};

// check draft open or not and return boolean
export const checkDreaftOpen = async () => {
  const res = await beforeDraft.get("/draft/check");
  return res.data;
}

export const addUsersToPreselect = async (id: string, user: IUserModel) => {
  try {
    await beforeDraft.put(`/pre-select/${id}/`, user);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const addUsersToDraft = async (id: string, user: IUserModel) => {
  try {
    await beforeDraft.put(`/select/${id}/`, user);
  } catch (error: any) {
    console.log(error.message);
  }
};