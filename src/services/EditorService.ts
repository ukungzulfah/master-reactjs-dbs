import ApiFetcher, { ApiResponse } from "../System/Lib/ApiFetcher";

export default class EditorService {

  // GET Request
  public static async getNode(): Promise<ApiResponse> {
    try {
      const apiFetcher = new ApiFetcher("https://api.server.com/editor");
      return await apiFetcher.get("/node");
    } catch (error) {
      console.error("Error fetching node:", error);
      throw error;
    }
  }

  // POST Request
  public static async createNode(data: any): Promise<ApiResponse> {
    try {
      const apiFetcher = new ApiFetcher("https://api.server.com/editor");
      return await apiFetcher.post("/node", data);
    } catch (error) {
      console.error("Error creating node:", error);
      throw error;
    }
  }

  // PUT Request
  public static async updateNode(nodeId: string, data: any): Promise<ApiResponse> {
    try {
      const apiFetcher = new ApiFetcher("https://api.server.com/editor");
      return await apiFetcher.put(`/node/${nodeId}`, data);
    } catch (error) {
      console.error("Error updating node:", error);
      throw error;
    }
  }

  // PATCH Request
  public static async patchNode(nodeId: string, data: any): Promise<ApiResponse> {
    try {
      const apiFetcher = new ApiFetcher("https://api.server.com/editor");
      return await apiFetcher.patch(`/node/${nodeId}`, data);
    } catch (error) {
      console.error("Error patching node:", error);
      throw error;
    }
  }

  // DELETE Request
  public static async deleteNode(nodeId: string): Promise<ApiResponse> {
    try {
      const apiFetcher = new ApiFetcher("https://api.server.com/editor");
      return await apiFetcher.delete(`/node/${nodeId}`);
    } catch (error) {
      console.error("Error deleting node:", error);
      throw error;
    }
  }
}
