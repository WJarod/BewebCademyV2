import axios from "axios";
import IUserModel from "../model/IUserModel";
import ISessionModel from "../model/ISessionModel";

const session = axios.create({
  baseURL: "https://session-service-production.up.railway.app/session"
})

export const getSessionByUserId = async (id: string) => {
  try {
    const data = await session.get(`/user/${id}`)

    return data.data
  }
  catch (error: any) {
    console.log(error.message);
  }
}


export const getSessions = async () => {
  try {
    const sessions = await session.get("/");

    await sessions.data.map((session: ISessionModel) => {
      session._id = session._id.toString();
    });
    return sessions.data;
  }
  catch (error: any) {
    console.log(error);
  }
};

export const createSession = async (formData: IUserModel) => {
  const newSession = await session.post("/", {
    badges: [],
    exercices: [],
    user: formData
  })
  console.log("up");
  console.log(newSession.data);

  return newSession.data
}

export const updateSession = async (id: string, formData: ISessionModel) => {
  try {
    await session.put(`/${id}`, { formData });
  } catch (error: any) {
    console.log(error.message);
  }
}