import { API_URL } from "../assets/config/config";
import ApiFetcher from "../System/Lib/ApiFetcher";

export default class ServiceProject {

    static async getListProject() {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get("/api/getAllProject");
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }

    static async getById(id: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/getProjectById/${id}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async searchByName(name: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/searchProjectByName?name=${name}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async create(data: any) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.post("/api/createProject", data);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async update(id: string, data: any) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.post(`/api/updateProject/${id}`, data);
        if (response.code === 200) {
            return response.data;
        }
        throw new Error(response.message);
    }
    static async delete(id: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.delete(`/api/deleteProject/${id}`);
        if (response.code === 200) {
            return response.data;
        }
        throw new Error(response.message);
    }

}