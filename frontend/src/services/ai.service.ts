import { axiosInstance } from "../utils/axios";

export const aiService = {

    recommendSpecialization: async (symptoms: string) => {
        const response = await axiosInstance.post("/ai/recommend", {
            symptoms,
        });

        return response.data;
    }

}