import { serverFetch } from "../core/server";

const baseUrl =process.env.NEXT_PUBLIC_BASE_URL;
export const getTrainerClasses = async (trainerId, status='Pending') => {
    const res = await fetch(`${baseUrl}/api/classes?trainerId=${trainerId}&status=${status}`);
    return res.json();
};



export const getAllClasses = async (status = "Approved") => {
  return serverFetch(`/api/classes/all?status=${status}`);
};

export const getClassById = async (id) => {
  return serverFetch(`/api/classes/${id}`);
};