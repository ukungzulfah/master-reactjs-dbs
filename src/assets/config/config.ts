// export const API_URL = "https://192.168.1.11/v1";
const isDev = import.meta.env.VITE_ENV === 'development';
export const API_URL = isDev
  ? 'http://localhost:3000/v1'  // atau IP LAN lo: http://192.168.1.11:3000/v1
  // ? 'http://192.168.100.50:3000/v1'  // atau IP LAN lo: http://192.168.1.11:3000/v1
  : 'https://repi-api-336781009919.asia-southeast2.run.app/v1';