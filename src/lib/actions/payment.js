"use server";

import { serverMutation } from "../core/server";


export const paymentDataSave = async (formData) => {
    return await serverMutation('/api/payments', formData);
}
