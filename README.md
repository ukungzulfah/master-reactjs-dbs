my-app/
│── public/              # File statis (favicon, index.html, dll.)
│── src/                 # Source code utama
│   │── assets/          # Gambar, ikon, font, atau style global
│   │── components/      # Komponen reusable (Button, Card, Navbar, dll.)
│   │── layouts/         # Struktur layout utama (DashboardLayout, AuthLayout, dll.)
│   │── pages/           # Halaman utama aplikasi (Home, Dashboard, Profile, dll.)
│   │── hooks/           # Custom hooks (useAuth, useFetch, dll.)
│   │── contexts/        # Context API (AuthContext, ThemeContext, dll.)
│   │── services/        # API calls atau integrasi eksternal (axios instance, API helpers)
│   │── store/           # State management (Redux, Zustand, Recoil, dll.)
│   │── utils/           # Fungsi helper/utilitas (formatDate, calculateTax, dll.)
│   │── routes/          # Konfigurasi routing aplikasi (index.js, protectedRoute.js)
│   │── App.js           # Root component
│   │── main.jsx         # Entry point (ReactDOM.render)
│── .env                 # Environment variables
│── package.json         # Dependencies & scripts
│── README.md            # Dokumentasi proyek