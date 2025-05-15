import { adminAPI } from "./httpService";
export interface Genre {
  id: number;
  name: string;
  created_at: string;
}

export const createGenre = async (name: string): Promise<any> => {
  const response = await adminAPI.post("/genres/create", { name });
  return response;
};

export const updateGenre = async (id: number, name: string): Promise<any> => {
  const response = await adminAPI.put(`/genres/${id}`, { name });
  return response;
};

export const deleteGenre = async (id: number): Promise<any> => {
  await adminAPI.delete(`/genres/${id}`);
};
