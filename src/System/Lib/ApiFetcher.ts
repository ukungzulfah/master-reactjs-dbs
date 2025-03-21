export interface ApiResponse {
  code: number;
  success: boolean;
  message: string;
  data: any;
}

const defaultTimeout: number = 10000;

export default class ApiFetcher {
  private baseUrl: string;
  private bearerToken?: string;

  constructor(baseUrl: string, bearerToken?: string) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
  }

  private checkInternetConnection(): boolean {
    if (!navigator.onLine) {
      console.error("Tidak ada koneksi internet. Pastikan perangkat Anda terhubung.");
      return false;
    }
    return true;
  }

  private handleResponseStatus(status: number): string {
    const statusMessages: Record<number, string> = {
      200: "Permintaan berhasil! (200)",
      201: "Data berhasil dibuat! (201)",
      400: "Permintaan tidak valid! (400)",
      401: "Anda tidak diotorisasi! (401)",
      403: "Akses dilarang! (403)",
      404: "Sumber daya tidak ditemukan! (404)",
      500: "Terjadi kesalahan pada server! (500)",
      503: "Server tidak tersedia! (503)",
    };
    return statusMessages[status] || `Kode respons tidak dikenal: ${status}`;
  }

  private async parseJsonSafely(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      console.error("Gagal parsing JSON. Format data dari server mungkin bermasalah.");
      throw new Error("Format JSON tidak valid.");
    }
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout = defaultTimeout): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  }

  private async request(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: any,
    headers: Record<string, string> = {},
    timeout = defaultTimeout
  ): Promise<ApiResponse> {
    if (!this.checkInternetConnection()) {
      return { code: 0, success: false, message: "Tidak ada koneksi internet.", data: null };
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          "Authorization": `Bearer ${this.bearerToken}`,
          "Content-Type": "application/json",
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
      }, timeout);

      const message = this.handleResponseStatus(response.status);

      if (!response.ok) {
        return { code: response.status, success: false, message, data: null };
      }

      const data = await this.parseJsonSafely(response);
      return { code: response.status, success: true, message, data };
    } catch (error: any) {
      const errorMessage = error.name === "AbortError"
        ? "Permintaan timeout. Silakan coba lagi."
        : "Terjadi kesalahan internal.";

      console.error("Terjadi kesalahan:", error);
      return { code: 500, success: false, message: errorMessage, data: null };
    }
  }

  public async get(endpoint: string, headers: Record<string, string> = {}, timeout = defaultTimeout) {
    return this.request(endpoint, 'GET', undefined, headers, timeout);
  }

  public async post(endpoint: string, body: any, headers: Record<string, string> = {}, timeout = defaultTimeout) {
    return this.request(endpoint, 'POST', body, headers, timeout);
  }

  public async put(endpoint: string, body: any, headers: Record<string, string> = {}, timeout = defaultTimeout) {
    return this.request(endpoint, 'PUT', body, headers, timeout);
  }

  public async patch(endpoint: string, body: any, headers: Record<string, string> = {}, timeout = defaultTimeout) {
    return this.request(endpoint, 'PATCH', body, headers, timeout);
  }

  public async delete(endpoint: string, headers: Record<string, string> = {}, timeout = defaultTimeout) {
    return this.request(endpoint, 'DELETE', undefined, headers, timeout);
  }
}
