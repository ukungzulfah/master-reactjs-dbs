import { API_URL } from "../assets/config/config";
import ApiFetcher from "../System/Lib/ApiFetcher";

export default class ServiceSetting {
    static async getAll() {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get("/api/getSetting");
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }

    static async create(data: any) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.post("/api/createSetting", data);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }

    static async update(id: string, data: any) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.post(`/api/updateSetting/${id}`, data);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }

    static async delete(id: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.delete(`/api/deleteSetting/${id}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }

    static async getByName(name: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/getSettingByName/${name}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }

    static async getByType(type: string) {
        const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
        const response = await fetcher.get(`/api/getSettingByType/${type}`);
        if (response.code === 200) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
}