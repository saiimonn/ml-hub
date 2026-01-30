import { API_BASE_URL } from "@/app/config/apiConfig";
import axios from "axios";
import type { Model } from "../types/models-page.types";

export const GetModels = async(): Promise<Model[]> => {
  const res = await axios.get(`${API_BASE_URL}/models/`);
  return res.data;
}

export const GetModelsById = async(modelId: string): Promise<Model> => {
  const res = await axios.get(`${API_BASE_URL}/models/${modelId}`);
  return res.data;
}