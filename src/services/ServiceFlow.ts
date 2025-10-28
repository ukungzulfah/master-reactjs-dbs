import { API_URL } from "../assets/config/config";
import ApiFetcher from "../System/Lib/ApiFetcher";

export default class ServiceFlow {

    static async getAll() {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get("/api/getAllFlow");
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async getById(id: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/getFlowById/${id}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async searchByPath(path: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/searchFlowByPath?path=${path}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async create(data: any) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.post("/api/createFlow", data);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
    static async update(id: string, data: any) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.post(`/api/updateFlow/${id}`, data);
        if (response.code === 200) {
            return response.data;
        }
        throw new Error(response.message);
    }
    static async delete(id: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.delete(`/api/deleteFlow/${id}`);
        if (response.code === 200) {
            return response.data;
        }
        throw new Error(response.message);
    }

    static async getByProject(id: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/getByProject/${id}`);
        if (response.code === 200) {
            return response.data;
        }
        throw new Error(response.message);
    }

}