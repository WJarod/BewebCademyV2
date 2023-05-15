import axios from "axios";
import ILanguageModel from "../model/ILanguageModel";

const language = axios.create({
  baseURL: "https://language-service-production.up.railway.app/language",
});

export const getLanguage = async (id: string) => {
  try {
    const data = await language.get(`/${id}`);
    await data.data.map((data: ILanguageModel) => {
      data._id = data._id.toString()
    })
    return data.data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getLanguages = async () => {
  const languages = await language.get("/");

  return languages.data;
};

export const updateLanguage = async (id: string, formData: ILanguageModel) => {
  try {
    await language.put(`/${id}`, formData);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const createLanguage = async (formData: ILanguageModel) => {
  try {
    await language.post('/', { formData })
  } catch (error: any) {
    console.log(error.message)
  }
}

export const deleteLanguageById = async (id: string) => {
  try {
    await language.delete(`/${id}`);
  } catch (error: any) {
    console.log(error.message);
  }
};