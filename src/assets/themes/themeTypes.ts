/**
 * Interface yang mendefinisikan tipe tema dengan berbagai warna dan elemen desain.
 */
export interface ThemeType {
    button: string;
    
    /**
     * Warna utama yang digunakan untuk elemen-elemen kunci dalam desain.
     */
    primary: string;

    /**
     * Warna sekunder yang digunakan untuk elemen-elemen pendukung atau alternatif dari warna utama.
     */
    secondary: string;

    /**
     * Warna teritiary (opsional) yang digunakan untuk elemen-elemen tambahan atau variasi dari warna utama dan sekunder.
     */
    tertiary?: string;

    /**
     * Warna yang menunjukkan status sukses, misalnya pada notifikasi atau indikator berhasil.
     */
    success: string;

    /**
     * Warna yang menunjukkan status peringatan, misalnya pada notifikasi atau indikator peringatan.
     */
    warning: string;

    /**
     * Warna yang menunjukkan status kesalahan, misalnya pada notifikasi atau indikator kesalahan.
     */
    error: string;

    /**
     * Warna yang menunjukkan status informasi, misalnya pada notifikasi atau indikator informasi.
     */
    info: string;

    /**
     * Warna teks utama yang digunakan untuk teks konten dasar.
     */
    textPrimary: string;

    /**
     * Warna teks sekunder yang digunakan untuk teks konten pendukung atau informasional.
     */
    textSecondary: string;

    /**
     * Warna teks yang digunakan untuk teks yang dinonaktifkan atau tidak dapat diinteraksi.
     */
    textDisabled: string;

    /**
     * Warna teks yang digunakan untuk teks yang berada di latar belakang berwarna gelap atau warna yang kontras tinggi.
     */
    textInverse: string;

    /**
     * Warna latar belakang utama untuk halaman atau kontainer utama.
     */
    background: string;

    /**
     * Warna latar belakang untuk elemen-elemen kertas atau komponen yang membutuhkan latar belakang yang lebih ringan.
     */
    backgroundPaper: string;

    /**
     * Warna border untuk elemen-elemen yang membutuhkan garis tepi.
     */
    border: string;

    /**
     * Warna pembagi antara elemen-elemen untuk memisahkan visualisasi.
     */
    divider: string;

    /**
     * Bayangan atau efek shadow yang digunakan untuk memberikan tampilan 3D atau mendalam pada elemen-elemen.
     */
    shadow: string;

    /**
     * Warna yang digunakan saat elemen-elemen dihover oleh user.
     */
    hover: string;

    /**
     * Warna yang digunakan saat elemen-elemen aktif atau sedang dipilih/ditekan oleh user.
     */
    active: string;

    /**
     * Warna latar belakang untuk input/form.
     */
    inputBackground: string;

    /**
     * Warna border untuk input/form.
     */
    inputBorder: string;

    /**
     * Warna teks untuk input/form.
     */
    inputText: string;

    /**
     * Warna untuk tautan (link) atau elemen yang diklik untuk navigasi.
     */
    link: string;

    /**
     * Warna untuk elemen-elemen yang dinonaktifkan atau tidak dapat diinteraksi.
     */
    disabled: string;

    /**
     * Mode tema yang menentukan apakah tema adalah 'light' atau 'dark'.
     */
    mode: 'light' | 'dark';
}