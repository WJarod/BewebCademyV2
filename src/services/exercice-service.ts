import axios from "axios";
import IExerciceModel from "../model/IExerciceModel";

const exercice = axios.create({
  baseURL: "https://exercice-service-production.up.railway.app/exercice",
});


export const getExerciceById = async (id: string) => {
  try {
    const data = await exercice.get(`/${id}`);
    return data.data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getExercices = async () => {
  try {
    const data = await exercice.get("/");
    await data.data.map((data: IExerciceModel) => {
      data._id = data._id.toString()
    })
    return data.data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const createExercice = async (formData: IExerciceModel) => {
  try {
    await exercice.post("/", { formData });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const deleteExerciceById = async (id: string) => {
  try {
    await exercice.delete(`/${id}`);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const updateExercice = async (id: string, formData: IExerciceModel) => {
  try {
    await exercice.put(`/${id}`, { formData });
  } catch (error: any) {
    console.log(error.message);
  }
};


export const getExerciceByBadgeId = async (id: string) => {
  try {
    const data = await exercice.get(`/badge/${id}`)
    await data.data.map((data: IExerciceModel) => {
      data.badges._id = data.badges._id.toString()
    })
    return data.data
  } catch (error: any) {
    console.log(error.message)
  }
}