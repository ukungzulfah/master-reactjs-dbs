// Definisikan tipe ApiResponse agar lebih jelas dan bisa generic
export interface ApiResponse<T = any> { // Menjadikannya generic
  code: number;
  success: boolean;
  message: string;
  data: T | null; // Menggunakan T dan null untuk konsistensi
}

const defaultTimeout: number = 1000000; // Sesuai dengan kode Anda

/**
 * ApiFetcher is a class that provides methods to make HTTP requests to a RESTful API,
 * now with interceptor capabilities.
 */
export default class ApiFetcher {
  private baseUrl: string;
  private bearerToken?: string;

  // Interceptor untuk request, response, dan error
  private requestInterceptors: Array<(config: RequestInit) => RequestInit | Promise<RequestInit>> = [];
  private responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = [];
  private errorInterceptors: Array<(error: any) => any | Promise<any>> = [];

  constructor(baseUrl: string, bearerToken?: string) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
  }

  /**
   * Sets or updates the bearer token for authorization.
   * @param token The bearer token string, or null/undefined to clear it.
   */
  public setBearerToken(token?: string | null): void {
    this.bearerToken = token || undefined;
  }

  // --- Bagian Interceptor ---
  /**
   * Adds a request interceptor.
   * @param interceptor A function that takes request config and returns modified config.
   */
  public addRequestInterceptor(interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Adds a response interceptor.
   * @param interceptor A function that takes a Response object and returns a (potentially modified) Response object.
   */
  public addResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Adds an error interceptor.
   * @param interceptor A function that takes an error object and returns a (potentially modified) error object.
   */
  public addErrorInterceptor(interceptor: (error: any) => any | Promise<any>): void {
    this.errorInterceptors.push(interceptor);
  }


  private checkInternetConnection(): boolean {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.error("Tidak ada koneksi internet. Pastikan perangkat Anda terhubung.");
      return false;
    }
    return true;
  }

  private handleResponseStatus(status: number): string {
    const statusMessages: Record<number, string> = {
      200: "Permintaan berhasil! (200)",
      201: "Data berhasil dibuat! (201)",
      204: "Permintaan berhasil, tidak ada konten untuk dikembalikan. (204)", // Added 204
      400: "Permintaan tidak valid! (400)",
      401: "Anda tidak diotorisasi! (401)",
      403: "Akses dilarang! (403)",
      404: "Sumber daya tidak ditemukan! (404)",
      408: "Permintaan timeout! (408)", // Added 408
      500: "Terjadi kesalahan pada server! (500)",
      503: "Server tidak tersedia! (503)",
    };
    return statusMessages[status] || `Kode respons tidak dikenal: ${status}`;
  }

  // Menggunakan versi parseJsonSafely yang lebih robust dari contoh sebelumnya
  private async parseJsonSafely(response: Response): Promise<any> {
    const text = await response.text();
    if (!text) {
      // Jika response body kosong (misalnya untuk 204 No Content atau jika API memang mengembalikan body kosong)
      return null;
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Gagal parsing JSON:", e, "Response text:", text.substring(0, 100) + "..."); // Log sebagian text
      throw new Error("Format respons JSON tidak valid."); // Lempar error spesifik
    }
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout = defaultTimeout): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.warn(`Request ke ${url} dihentikan karena timeout (${timeout}ms).`);
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        // Error bisa jadi AbortError (karena timeout) atau network error lainnya
        throw error;
    }
  }

  private async request<T = any>( // Menjadikannya generic
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: any,
    customHeaders: Record<string, string> = {},
    timeout = defaultTimeout
  ): Promise<ApiResponse<T>> { // Menggunakan ApiResponse<T>
    if (!this.checkInternetConnection()) {
      return { code: 0, success: false, message: "Tidak ada koneksi internet.", data: null };
    }

    let headers: HeadersInit = {
      "Content-Type": "application/json", // Default Content-Type
      ...customHeaders, // customHeaders bisa menimpa default
    };

    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }

    // Hapus Content-Type jika body tidak ada (misalnya untuk GET, DELETE)
    // atau jika body adalah FormData (fetch akan set Content-Type multipart/form-data otomatis)
    if (!body || body instanceof FormData) {
        // TypeScript tidak suka menghapus properti dari HeadersInit secara langsung jika itu objek literal.
        // Jadi kita buat objek baru jika perlu.
        const tempHeaders = {...headers};
        delete tempHeaders["Content-Type"];
        headers = tempHeaders;
    }


    let fetchOptions: RequestInit = {
      method,
      headers,
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    try {
      // --- Jalankan Request Interceptors ---
      for (const interceptor of this.requestInterceptors) {
        fetchOptions = await interceptor(fetchOptions);
      }

      let response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, fetchOptions, timeout);

      // --- Jalankan Response Interceptors ---
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response); // Interceptor bisa mengganti response
      }

      const responseStatusMessage = this.handleResponseStatus(response.status);

      if (!response.ok) { // Mencakup status 4xx dan 5xx
        let errorData: any = null;
        try {
          // Clone response karena body hanya bisa dibaca sekali.
          // Penting jika response interceptor juga membaca body.
          errorData = await this.parseJsonSafely(response.clone());
        } catch (e: any) {
          // Gagal parse body error, atau body error bukan JSON / kosong
          return {
            code: response.status,
            success: false,
            message: e.message || "Gagal memproses respons error dari server.", // Pesan dari parseJsonSafely atau default
            data: null,
          };
        }
        // Pesan error: dari data JSON > response.statusText > pesan status default
        const errorMessage = errorData?.message || errorData?.error || response.statusText || responseStatusMessage;
        return {
          code: response.status,
          success: false,
          message: errorMessage,
          data: errorData?.data || errorData || null, // Kembalikan data error jika ada
        };
      } else {
        // Handle response sukses (2xx)
        if (response.status === 204 || response.headers.get('content-length') === '0') { // No Content
             return {
                code: response.status,
                success: true,
                message: responseStatusMessage,
                data: null
             };
        }
        try {
          const parsedData = await this.parseJsonSafely(response);
          // Asumsi backend bisa mengembalikan { data: ..., message: ... } atau langsung data
          return {
            code: response.status,
            success: true,
            message: parsedData?.message || responseStatusMessage,
            data: parsedData?.data !== undefined ? parsedData.data : parsedData,
          };
        } catch (error: any) {
          // Terjadi jika parseJsonSafely melempar error (misal, format tidak valid setelah interceptor)
          return {
            code: response.status,
            success: false,
            message: error.message || "Gagal memproses data dari server.",
            data: null,
          };
        }
      }
    } catch (error: any) {
      // --- Jalankan Error Interceptors ---
      let processedError = error;
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }

      // Tangani error dari fetchWithTimeout (network error, abort) atau error dari interceptor
      let errorMessage = processedError.message || "Terjadi kesalahan jaringan atau internal.";
      let errorCode = 500; // Default error code

      if (processedError.name === 'AbortError') {
        errorMessage = this.handleResponseStatus(408); // Pesan timeout dari handleResponseStatus
        errorCode = 408; // Request Timeout
      }
      // Jika processedError adalah instance dari Error dan memiliki properti 'code' atau 'status'
      // Anda bisa menggunakan itu jika relevan
      // if (processedError instanceof Error && (processedError as any).code) {
      //   errorCode = (processedError as any).code;
      // }

      return { code: errorCode, success: false, message: errorMessage, data: null };
    }
  }

  /**
   * Makes a GET request.
   * @param endpoint The API endpoint.
   * @param headers Custom headers.
   * @param timeout Request timeout.
   * @returns Promise<ApiResponse<T>>
   */
  public async get<T = any>(endpoint: string, headers: Record<string, string> = {}, timeout = defaultTimeout): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, headers, timeout);
  }

  /**
   * Makes a POST request.
   * @param endpoint The API endpoint.
   * @param body The request body.
   * @param headers Custom headers.
   * @param timeout Request timeout.
   * @returns Promise<ApiResponse<T>>
   */
  public async post<T = any>(endpoint: string, body: any, headers: Record<string, string> = {}, timeout = defaultTimeout): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', body, headers, timeout);
  }

  /**
   * Makes a PUT request.
   * @param endpoint The API endpoint.
   * @param body The request body.
   * @param headers Custom headers.
   * @param timeout Request timeout.
   * @returns Promise<ApiResponse<T>>
   */
  public async put<T = any>(endpoint: string, body: any, headers: Record<string, string> = {}, timeout = defaultTimeout): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', body, headers, timeout);
  }

  /**
   * Makes a PATCH request.
   * @param endpoint The API endpoint.
   * @param body The request body.
   * @param headers Custom headers.
   * @param timeout Request timeout.
   * @returns Promise<ApiResponse<T>>
   */
  public async patch<T = any>(endpoint: string, body: any, headers: Record<string, string> = {}, timeout = defaultTimeout): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', body, headers, timeout);
  }

  /**
   * Makes a DELETE request.
   * @param endpoint The API endpoint.
   * @param headers Custom headers.
   * @param timeout Request timeout.
   * @returns Promise<ApiResponse<T>>
   */
  public async delete<T = any>(endpoint: string, headers: Record<string, string> = {}, timeout = defaultTimeout): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, headers, timeout);
  }
}

// // --- Contoh Penggunaan ApiFetcher dengan Interceptor ---
// async function contohPenggunaanApiFetcher() {
//   // Pastikan localStorage tersedia jika digunakan (misalnya di browser)
//   if (typeof localStorage !== 'undefined') {
//     localStorage.setItem('authToken', 'dummy-bearer-token-12345');
//   }

//   const apiClient = new ApiFetcher("https://jsonplaceholder.typicode.com"); // Contoh API publik

//   // Ambil token jika ada (misalnya dari localStorage)
//   const token = typeof localStorage !== 'undefined' ? localStorage.getItem("authToken") : null;
//   if (token) {
//     apiClient.setBearerToken(token);
//   }

//   // --- Contoh Request Interceptor ---
//   // 1. Menambahkan header kustom untuk setiap request
//   apiClient.addRequestInterceptor(async (config) => {
//     console.log("REQUEST INTERCEPTOR: Menambahkan X-Request-ID");
//     config.headers = {
//       ...config.headers,
//       'X-Request-ID': `req-${Date.now()}`,
//     };
//     return config;
//   });

//   // 2. Logging detail request sebelum dikirim
//   apiClient.addRequestInterceptor(async (config) => {
//     console.log(`REQUEST INTERCEPTOR: Mengirim ${config.method} request ke URL tertentu (path tidak ditampilkan di sini), Headers:`, config.headers);
//     if (config.body) {
//         // Hati-hati logging body, bisa berisi data sensitif
//         // console.log("REQUEST INTERCEPTOR: Body:", config.body);
//     }
//     return config;
//   });


//   // --- Contoh Response Interceptor ---
//   // 1. Logging status response mentah
//   apiClient.addResponseInterceptor(async (response) => {
//     console.log(`RESPONSE INTERCEPTOR: Menerima response dengan status: ${response.status} dari ${response.url}`);
//     // Jika ingin membaca body di sini, response perlu di-clone() karena body hanya bisa dibaca sekali.
//     // const clonedResponse = response.clone();
//     // const responseData = await clonedResponse.json().catch(() => ({ message: "Bukan JSON atau body kosong" }));
//     // console.log("RESPONSE INTERCEPTOR: Data mentah (jika JSON):", responseData);
//     return response; // Kembalikan response asli atau yang sudah dimodifikasi
//   });

//   // 2. Contoh: Penanganan khusus untuk status tertentu (misal, refresh token jika 401)
//   //    Ini adalah contoh sederhana, implementasi refresh token yang sebenarnya lebih kompleks.
//   apiClient.addResponseInterceptor(async (response) => {
//     if (response.status === 401) {
//       console.warn("RESPONSE INTERCEPTOR: Terdeteksi 401 Unauthorized!");
//       // Di sini bisa ada logic untuk:
//       // 1. Mencoba refresh token.
//       // 2. Jika berhasil, update token di apiClient.setBearerToken().
//       // 3. Mengulang request asli dengan token baru. (Ini bagian yang rumit, seringkali melibatkan antrian request)
//       // Untuk contoh ini, kita hanya log. Jika logic refresh token gagal, error akan ditangani oleh .catch() atau error interceptor.
//       // Jika Anda ingin melempar error dari sini agar request gagal, Anda bisa:
//       // throw new Error("Sesi berakhir, gagal refresh token.");
//     }
//     return response;
//   });

//   // --- Contoh Error Interceptor ---
//   // 1. Logging semua error yang terjadi selama request/response
//    apiClient.addErrorInterceptor(async (error) => {
//     console.error("ERROR INTERCEPTOR: Terjadi error pada proses request/response:", error.message, error);
//     // Anda bisa mengirim error ini ke service logging eksternal seperti Sentry
//     // Sentry.captureException(error);

//     // Anda bisa juga memodifikasi error sebelum dikembalikan ke pemanggil
//     // error.isCritical = true;
//     return error; // Kembalikan error (bisa juga error yang sudah dimodifikasi)
//   });


//   // Contoh pemanggilan API
//   try {
//     console.log("Memanggil GET /users/1...");
//     // Tentukan tipe data yang diharapkan untuk 'data'
//     interface User { id: number; name: string; email: string; }
//     const userResponse = await apiClient.get<User>('/users/1');

//     if (userResponse.success && userResponse.data) {
//       console.log("Data Pengguna (GET):", userResponse.data.name, "-", userResponse.data.email);
//       console.log("Pesan Sukses (GET):", userResponse.message);
//     } else {
//       console.error("Gagal mendapatkan pengguna (GET):", userResponse.message, "Code:", userResponse.code);
//     }

//     console.log("\nMemanggil POST /posts...");
//     interface Post { id?: number; title: string; body: string; userId: number; }
//     const newPost: Omit<Post, 'id'> = { title: 'Contoh Post Baru', body: 'Ini adalah isi dari post baru.', userId: 1 };
//     const createPostResponse = await apiClient.post<Post>('/posts', newPost);

//     if (createPostResponse.success && createPostResponse.data) {
//       console.log("Post berhasil dibuat (POST):", createPostResponse.data);
//       console.log("Pesan Sukses (POST):", createPostResponse.message);
//     } else {
//       console.error("Gagal membuat post (POST):", createPostResponse.message, "Code:", createPostResponse.code);
//     }

//     // Contoh request yang mungkin menghasilkan error 404
//     console.log("\nMemanggil GET /nonexistent/endpoint...");
//     const notFoundResponse = await apiClient.get('/nonexistent/endpoint');
//     if (!notFoundResponse.success) {
//         console.warn(`Request ke /nonexistent/endpoint gagal seperti yang diharapkan: Pesan: "${notFoundResponse.message}", Code: ${notFoundResponse.code}`);
//     }

//   } catch (error: any) {
//     // Catch ini akan menangkap error yang tidak tertangani di dalam method `request`
//     // atau error yang dilempar ulang oleh error interceptor dan tidak di-handle sebagai ApiResponse.
//     // Umumnya, method `request` sudah mengembalikan ApiResponse error, jadi blok ini jarang terpicu
//     // kecuali ada error fundamental di luar alur fetch (misal, error di interceptor yang tidak dikembalikan sebagai error yang dikenali).
//     console.error("Error tidak terduga di level aplikasi (luar ApiFetcher):", error.message);
//   }
// }

// // Panggil fungsi contoh (biasanya dipanggil saat aplikasi dimulai atau modul di-load)
// // Untuk lingkungan browser:
// if (typeof window !== 'undefined') {
//     contohPenggunaanApiFetcher();
// } else {
//     console.log("Menjalankan di lingkungan non-browser, contohPenggunaanApiFetcher() tidak dieksekusi otomatis.");
//     // Anda bisa memanggilnya secara manual jika diperlukan untuk testing di Node.js (pastikan fetch tersedia global)
//     // contohPenggunaanApiFetcher();
// }
