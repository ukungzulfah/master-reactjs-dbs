type DataType = {
    [key: string]: {
        text: string;
        code: string;
    };
};

class LocalStorageAdapter {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;

        // Inisialisasi data jika belum ada
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    // Ambil data dari localStorage
    private getData(): DataType {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    // Simpan data ke localStorage
    private setData(data: DataType): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Update text berdasarkan key
    updateTextByKey(key: string, newText: string): void {
        const data = this.getData();
        if (!data[key]) {
            data[key] = { text: newText, code: '' }; // Jika key belum ada, inisialisasi data baru
        } else {
            data[key].text = newText;
        }
        this.setData(data);
    }

    // Update code berdasarkan key
    updateCodeByKey(key: string, newCode: string): void {
        const data = this.getData();
        if (!data[key]) {
            data[key] = { text: '', code: newCode }; // Jika key belum ada, inisialisasi data baru
        } else {
            data[key].code = newCode;
        }
        this.setData(data);
    }

    // Ambil data berdasarkan key
    getDataByKey(key: string): { text: string; code: string } | null {
        const data = this.getData();
        return data[key] || null;
    }

    // Hapus data berdasarkan key
    removeByKey(key: string): void {
        const data = this.getData();
        if (data[key]) {
            delete data[key];
            this.setData(data);
        }
    }

    // Hapus semua data
    clear(): void {
        localStorage.removeItem(this.storageKey);
    }
}

export default LocalStorageAdapter;