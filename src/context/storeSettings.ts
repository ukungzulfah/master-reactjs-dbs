import buildingStore from "../System/Lib/Widgets";

/**
 * Represents the type of a setting item.
 */
export type SettingItemType =
  | 'text'
  | 'select'
  | 'boolean'
  | 'button'
  | 'number'
  | 'list'
  | 'textarea'
  | 'file';

/**
 * Represents a single setting item within a group.
 */
export interface SettingItem {
  key: string; // Unique identifier for the setting
  label: string; // Display name for the setting
  type: SettingItemType; // The type of input/control for the setting
  icon: string; // Google Material Icon name for the item
  desc: string; // Short description of the setting
  long_desc: string; // Longer, more detailed description of the setting
  default?: string | number | boolean; // Default value (type depends on SettingItemType), optional for some types
  options?: string[]; // Array of options, only applicable if type is 'select'
  action?: string; // Action identifier, only applicable if type is 'button'
  readonly?: boolean; // Indicates if the item is read-only, optional
}

/**
 * Represents a group of related settings.
 */
export interface SettingsGroup {
  group: string; // The name of the settings group
  icon: string; // Google Material Icon name for the group
  items: SettingItem[]; // An array of setting items belonging to this group
}

export interface SettingsConfig {
  settings: SettingsGroup[]; // An array of all settings groups
}

export default buildingStore(
    'setting',
    {
        "settings": [
          {
            "group": "General",
            "icon": "settings", // Icon untuk grup General
            "items": [
              {
                "key": "instance_name",
                "label": "Instance Name",
                "type": "text",
                "default": "My Automation Engine",
                "desc": "Nama aplikasi",
                "long_desc": "Nama unik untuk membedakan instance aplikasi ini, bisa berupa nama proyek atau organisasi.",
                "icon": "label" // Icon untuk Instance Name
              },
              {
                "key": "timezone",
                "label": "Default Timezone",
                "type": "select",
                "options": ["UTC", "Asia/Jakarta", "Asia/Singapore"],
                "default": "Asia/Jakarta",
                "desc": "Zona waktu default",
                "long_desc": "Zona waktu yang digunakan untuk semua eksekusi dan penjadwalan workflow.",
                "icon": "schedule" // Icon untuk Timezone
              },
              {
                "key": "language",
                "label": "Language",
                "type": "select",
                "options": ["en", "id"],
                "default": "en",
                "desc": "Bahasa aplikasi",
                "long_desc": "Bahasa yang akan digunakan dalam antarmuka pengguna aplikasi.",
                "icon": "language" // Icon untuk Language
              },
              {
                "key": "autosave",
                "label": "Auto Save Workflow",
                "type": "boolean",
                "default": true,
                "desc": "Simpan otomatis",
                "long_desc": "Jika aktif, perubahan pada workflow akan disimpan otomatis tanpa perlu menekan tombol save.",
                "icon": "save" // Icon untuk Auto Save
              }
            ]
          },
          {
            "group": "User Management",
            "icon": "manage_accounts", // Icon untuk grup User Management
            "items": [
              {
                "key": "enable_invite",
                "label": "Enable Invite",
                "type": "boolean",
                "default": true,
                "desc": "Izinkan undang user",
                "long_desc": "Mengizinkan admin untuk mengundang pengguna baru ke sistem.",
                "icon": "person_add" // Icon untuk Enable Invite
              },
              {
                "key": "roles",
                "label": "Manage Roles",
                "type": "button",
                "action": "open_roles_management",
                "desc": "Kelola peran pengguna",
                "long_desc": "Membuka pengaturan peran dan izin untuk pengguna yang ada di sistem.",
                "icon": "admin_panel_settings" // Icon untuk Manage Roles
              },
              {
                "key": "api_token",
                "label": "Personal API Token",
                "type": "text",
                "readonly": true,
                "desc": "Token API pribadi",
                "long_desc": "Token unik untuk mengakses API secara pribadi, hanya bisa dilihat oleh pemiliknya.",
                "icon": "vpn_key" // Icon untuk API Token
              }
            ]
          },
          {
            "group": "Workflow Settings",
            "icon": "account_tree", // Icon untuk grup Workflow Settings
            "items": [
              {
                "key": "retry_policy",
                "label": "Default Retry Count",
                "type": "number",
                "default": 3,
                "desc": "Jumlah ulangi default",
                "long_desc": "Berapa kali workflow akan mencoba ulang task yang gagal sebelum benar-benar gagal.",
                "icon": "replay" // Icon untuk Retry Policy
              },
              {
                "key": "timeout",
                "label": "Default Timeout (seconds)",
                "type": "number",
                "default": 300,
                "desc": "Waktu tunggu default",
                "long_desc": "Durasi maksimum eksekusi per task sebelum dianggap timeout.",
                "icon": "timer" // Icon untuk Timeout
              },
              {
                "key": "parallel_execution",
                "label": "Allow Parallel Execution",
                "type": "boolean",
                "default": false,
                "desc": "Izinkan eksekusi paralel",
                "long_desc": "Jika aktif, workflow yang sama dapat berjalan bersamaan di waktu yang sama.",
                "icon": "splitscreen" // Icon untuk Parallel Execution
              }
            ]
          },
          {
            "group": "Execution Logs",
            "icon": "history", // Icon untuk grup Execution Logs
            "items": [
              {
                "key": "retention_days",
                "label": "Log Retention (days)",
                "type": "number",
                "default": 30,
                "desc": "Simpan log berapa lama",
                "long_desc": "Jumlah hari log eksekusi disimpan sebelum dihapus otomatis.",
                "icon": "update" // Icon untuk Log Retention
              },
              {
                "key": "enable_logs",
                "label": "Enable Logs",
                "type": "boolean",
                "default": true,
                "desc": "Aktifkan log",
                "long_desc": "Mengaktifkan atau menonaktifkan pencatatan eksekusi workflow.",
                "icon": "toggle_on" // Icon untuk Enable Logs
              }
            ]
          },
          {
            "group": "Notifications",
            "icon": "notifications", // Icon untuk grup Notifications
            "items": [
              {
                "key": "email_notif",
                "label": "Email Notification",
                "type": "boolean",
                "default": false,
                "desc": "Notifikasi lewat email",
                "long_desc": "Mengirim email notifikasi ketika workflow gagal atau berhasil sesuai pengaturan.",
                "icon": "email" // Icon untuk Email Notification
              },
              {
                "key": "slack_webhook",
                "label": "Slack Webhook URL",
                "type": "text",
                "default": "",
                "desc": "URL webhook Slack",
                "long_desc": "URL webhook untuk mengirim notifikasi ke Slack channel tertentu.",
                "icon": "webhook" // Icon untuk Slack Webhook
              },
              {
                "key": "notif_on_failure",
                "label": "Notify on Failure Only",
                "type": "boolean",
                "default": true,
                "desc": "Hanya saat gagal",
                "long_desc": "Jika aktif, hanya mengirim notifikasi ketika workflow gagal.",
                "icon": "notification_important" // Icon untuk Notify on Failure
              }
            ]
          },
          {
            "group": "API & Webhook",
            "icon": "api", // Icon untuk grup API & Webhook
            "items": [
              {
                "key": "global_api_key",
                "label": "Global API Key",
                "type": "text",
                "readonly": true,
                "desc": "Kunci API global",
                "long_desc": "Kunci API utama untuk semua permintaan API publik.",
                "icon": "key" // Icon untuk Global API Key
              },
              {
                "key": "ip_whitelist",
                "label": "IP Whitelist",
                "type": "textarea",
                "default": "",
                "desc": "Daftar IP yang diizinkan",
                "long_desc": "Daftar IP yang diizinkan mengakses API publik dan webhook.",
                "icon": "rule" // Icon untuk IP Whitelist
              },
              {
                "key": "webhook_secret",
                "label": "Webhook Secret",
                "type": "text",
                "default": "",
                "desc": "Rahasia webhook",
                "long_desc": "Secret token untuk memvalidasi bahwa permintaan webhook berasal dari sumber terpercaya.",
                "icon": "password" // Icon untuk Webhook Secret
              }
            ]
          },
          {
            "group": "Plugins",
            "icon": "extension", // Icon untuk grup Plugins
            "items": [
              {
                "key": "installed_plugins",
                "label": "Installed Plugins",
                "type": "list",
                "readonly": true,
                "desc": "Plugin terpasang",
                "long_desc": "Daftar plugin yang sudah terpasang dan aktif di sistem.",
                "icon": "inventory_2" // Icon untuk Installed Plugins
              },
              {
                "key": "marketplace",
                "label": "Open Marketplace",
                "type": "button",
                "action": "open_marketplace",
                "desc": "Buka marketplace",
                "long_desc": "Membuka marketplace untuk menemukan dan memasang plugin baru.",
                "icon": "storefront" // Icon untuk Marketplace
              }
            ]
          },
          {
            "group": "System",
            "icon": "settings_system_daydream", // Icon untuk grup System
            "items": [
              {
                "key": "backup",
                "label": "Backup Now",
                "type": "button",
                "action": "backup_now",
                "desc": "Backup sistem",
                "long_desc": "Melakukan backup penuh semua workflow dan konfigurasi.",
                "icon": "backup" // Icon untuk Backup
              },
              {
                "key": "restore",
                "label": "Restore Backup",
                "type": "file",
                "desc": "Restore dari backup",
                "long_desc": "Memilih file backup untuk mengembalikan sistem ke keadaan sebelumnya.",
                "icon": "settings_backup_restore" // Icon untuk Restore
              },
              {
                "key": "clear_cache",
                "label": "Clear Cache",
                "type": "button",
                "action": "clear_cache",
                "desc": "Bersihkan cache",
                "long_desc": "Menghapus cache sistem untuk memperbarui data yang tersimpan.",
                "icon": "cleaning_services" // Icon untuk Clear Cache
              }
            ]
          },
          {
            "group": "Advanced",
            "icon": "build", // Icon untuk grup Advanced
            "items": [
              {
                "key": "json_editor",
                "label": "Enable JSON Editor",
                "type": "boolean",
                "default": false,
                "desc": "Aktifkan JSON editor",
                "long_desc": "Mengizinkan pengguna power-user untuk mengedit workflow dalam format JSON langsung.",
                "icon": "data_object" // Icon untuk JSON Editor
              },
              {
                "key": "developer_mode",
                "label": "Developer Mode",
                "type": "boolean",
                "default": false,
                "desc": "Mode pengembang",
                "long_desc": "Memunculkan fitur dan log tambahan untuk debugging dan pengembangan.",
                "icon": "terminal" // Icon untuk Developer Mode
              }
            ]
          },
          {
            "group": "Security",
            "icon": "security", // Icon untuk grup Security
            "items": [
              {
                "key": "password_policy",
                "label": "Password Policy",
                "type": "select",
                "options": ["weak", "medium", "strong"],
                "default": "medium",
                "desc": "Kebijakan password",
                "long_desc": "Menentukan seberapa kuat password yang harus dibuat oleh pengguna.",
                "icon": "policy" // Icon untuk Password Policy
              },
              {
                "key": "enable_2fa",
                "label": "Enable 2FA",
                "type": "boolean",
                "default": false,
                "desc": "Aktifkan 2FA",
                "long_desc": "Mengaktifkan otentikasi dua faktor untuk meningkatkan keamanan login.",
                "icon": "phonelink_lock" // Icon untuk Enable 2FA
              },
              {
                "key": "audit_log",
                "label": "Audit Log",
                "type": "button",
                "action": "view_audit_log",
                "desc": "Lihat log audit",
                "long_desc": "Melihat riwayat aktivitas dan perubahan penting di sistem untuk keperluan audit.",
                "icon": "manage_search" // Icon untuk Audit Log
              }
            ]
          }
        ] as SettingsGroup[],
        
      },
    {
        
    },
    _ => false,
    ___ => ({
        
    })
)