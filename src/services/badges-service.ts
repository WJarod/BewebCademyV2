import axios from "axios";
import IBadgesModel from "../model/IBadgesModel";

const badge = axios.create({
  baseURL: "https://badge-service-production.up.railway.app/badge",
});

export const getBadgeById = async (id: string) => {
  try {
    const data = await badge.get(`/${id}`);
    return data.data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getBadges = async () => {
  const badges = await badge.get("/");

  await badges.data.map((badge: IBadgesModel) => {
    badge._id = badge._id.toString();
  });
  return badges.data;
};

export const createBadge = async (formData: IBadgesModel) => {
  try {
    await badge.post("/", { formData });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const updateBadge = async (formData: IBadgesModel, id: string) => {
  try {
    await badge.put(`/${id}`, { formData });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const deleteBadge = async (id: string) => {
  try {
    await badge.delete(`/${id}`);
  } catch (error: any) {
    console.log(error.message);
  }
};