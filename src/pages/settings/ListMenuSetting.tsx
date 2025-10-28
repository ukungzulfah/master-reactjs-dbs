import { SettingItem, SettingsGroup } from '../../context/storeSettings';
import { Row, Space, Click, Expanded, SingleChildScrollView, Column, Text, Icon, Container, Switch, TextField } from '../../System/Lib/Widgets';

const SelectPlaceholder = ({ value }: { value: string; options: string[] }) => {
    // Placeholder visual untuk select
    return Row({
        children: [
            Text(value, { color: "#424242" }),
            Space(5),
            Icon("arrow_drop_down", { color: "#616161" })
        ]
    });
};

const ButtonPlaceholder = ({ label, onClick }: { label: string; onClick: () => void }) => {
    // Placeholder visual untuk button
    return Click({
        click: onClick,
        child: Container({
            padding: "8px 12px",
            backgroundColor: "#e0e0e0", // Warna abu-abu netral
            borderRadius: "4px",
            child: Text(label, { color: "#424242", fontWeight: "500" })
        })
    });
};

const FileInputPlaceholder = () => {
    // Placeholder visual untuk file input
    return ButtonPlaceholder({ label: "Choose File", onClick: () => console.log("Choose file clicked") });
};

const ListPlaceholder = ({ items }: { items: any[] }) => {
    // Placeholder visual untuk list (misal: plugin terpasang)
    return Container({
        padding: "4px 8px",
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        child: Text(items && items.length > 0 ? `${items.length} items` : "(empty list)", { color: "#616161", fontStyle: "italic" })
    });
};

const renderSettingControl = (item: SettingItem) => {
    switch (item.type) {
        case 'boolean':
            // Ganti ini dengan komponen Switch asli lu
            return Switch({ value: item.default as boolean, onChange: (v: any) => console.log(`${item.key} changed to ${v}`) });
        case 'select':
            // Ganti ini dengan komponen Select asli lu
            return SelectPlaceholder({ value: item.default as string, options: item.options || [] });
        case 'button':
            // Ganti ini dengan komponen Button asli lu
            return ButtonPlaceholder({ label: item.label, onClick: () => console.log(`Button ${item.action} clicked`) });
        case 'number':
        case 'text':
            // Ganti ini dengan komponen TextInput asli lu
            return TextField({ value: item.default as string | number });
        case 'textarea':
            // Ganti ini dengan komponen Textarea asli lu
            return TextField({ value: item.default as string });
        case 'file':
            // Ganti ini dengan komponen FileInput asli lu
            return FileInputPlaceholder();
        case 'list':
            // Ganti ini dengan komponen List display asli lu
            // Asumsi 'default' untuk list mungkin tidak ada atau berupa array kosong
            return ListPlaceholder({ items: (item.default as unknown as any[]) || [] });
        default:
            return Text(`Unsupported type: ${item.type}`, { color: "red" });
    }
};

// --- Komponen Utama Settings ---
export default function SettingsPage({list}: {list: SettingsGroup[]}) {
    //{ settingsData }: { settingsData: SettingsConfig }

    return Expanded({ // Memastikan konten mengisi ruang yang tersedia
        child: SingleChildScrollView({ // Membuat konten bisa di-scroll jika melebihi layar
            child: Column({
                padding: "16px", // Padding keseluruhan halaman
                gap: "24px", // Jarak antar grup setting
                children: list.map((group: SettingsGroup, groupIndex: number) => {
                    return Container({
                        key: `group-${groupIndex}`,
                        backgroundColor: "white",
                        borderRadius: "8px", // Sudut membulat
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Shadow halus
                        child: Column({
                            children: [
                                // Header Grup
                                Container({
                                    padding: "12px 16px",
                                    borderBottom: "1px solid #eeeeee", // Garis pemisah halus
                                    child: Row({
                                        crossAxisAlignment: "center",
                                        children: [
                                            Icon(group.icon, { color: "#1976D2", size: 24 }), // Icon grup dengan warna primer
                                            Space(12), // Jarak antara ikon dan teks
                                            Text(group.group, { fontSize: "1.1em", fontWeight: "bold", color: "#333333" }), // Nama grup
                                        ]
                                    })
                                }),

                                // Daftar Item dalam Grup
                                Column({
                                    padding: "8px 16px 16px 16px", // Padding untuk item
                                    gap: "16px", // Jarak antar item setting
                                    children: group.items.map((item: SettingItem, itemIndex: number) => {
                                        return Container({
                                            key: `item-${groupIndex}-${itemIndex}`,
                                            child: Row({
                                                crossAxisAlignment: "center", // Align vertikal tengah
                                                mainAxisAlignment: "spaceBetween", // Beri jarak antara kiri dan kanan
                                                children: [
                                                    // Kolom Kiri (Ikon, Label, Deskripsi)
                                                    Row({
                                                        crossAxisAlignment: "start", // Ikon align ke atas teks jika teksnya wrap
                                                        children: [
                                                            Container({ // Container untuk ikon agar ada padding jika perlu
                                                                paddingTop: "4px", // Sedikit padding atas untuk ikon
                                                                child: Icon(item.icon, { color: "#616161", size: 20 }) // Icon item lebih kecil & abu-abu
                                                            }),
                                                            Space(12),
                                                            Expanded({ // Biarkan teks mengambil sisa ruang
                                                                child: Column({
                                                                    crossAxisAlignment: "start", // Teks rata kiri
                                                                    children: [
                                                                        Text(item.label, { fontWeight: "500", color: "#424242" }), // Label item
                                                                        Space(2),
                                                                        Text(item.desc, { color: "#75757d", fontSize: "0.9em" }), // Deskripsi item
                                                                    ]
                                                                })
                                                            })
                                                        ]
                                                    }),

                                                    // Kolom Kanan (Kontrol Input)
                                                    Container({ // Wadah untuk kontrol input
                                                        child: renderSettingControl(item) // Render kontrol yang sesuai
                                                    })
                                                ]
                                            })
                                        });
                                    })
                                })
                            ]
                        })
                    });
                })
            })
        })
    }).builder();
};