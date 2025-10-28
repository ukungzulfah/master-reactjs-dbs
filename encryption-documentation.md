# 🔐 Encryption & Decryption Documentation

## Overview

Sistem ini menggunakan enkripsi **AES-256-CBC** dengan **HMAC-SHA256** untuk mengamankan data sensitif sebelum disimpan dalam JWT token. Implementasi menggunakan PHP-style serialization untuk kompatibilitas dengan backend Laravel.

## Table of Contents

- [Security Architecture](#security-architecture)
- [encryptData Function](#encryptdata-function)
- [decryptData Function](#decryptdata-function)
- [Configuration](#configuration)
- [Examples](#examples)
- [Security Considerations](#security-considerations)

---

## Security Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Plain Data    │ →  │  encryptData │ →  │ Encrypted Data  │
│   "APP123456"   │    │   Function   │    │  (Base64 JSON)  │
└─────────────────┘    └──────────────┘    └─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Security Layers   │
                    │                     │
                    │ 1. PHP Serialize    │
                    │ 2. AES-256-CBC      │
                    │ 3. Random IV        │
                    │ 4. HMAC-SHA256      │
                    │ 5. Base64 Package   │
                    └─────────────────────┘
```

---

## encryptData Function

### Function Signature
```typescript
export const encryptData = (value: string) => string
```

### Process Flow

#### 1. Key Preparation
```typescript
const appKeyBase64 = config.APP_KEY;
const key = appKeyBase64.startsWith("base64:")
    ? Buffer.from(appKeyBase64.replace("base64:", ""), "base64")
    : Buffer.from(appKeyBase64, "utf8");
```

**Description:**
- Extracts encryption key from environment variable `APP_KEY`
- Supports two formats:
  - `base64:YWJjZGVmZ2hpams...` → Decode from base64
  - `plaintext_key` → Convert from utf8
- Result: 32-byte binary key for AES-256

#### 2. Data Serialization
```typescript
const serialized = serialize(value);
```

**Description:**
- Uses PHP-style serialization (not JSON)
- Ensures compatibility with Laravel/PHP backends
- Converts string input to serialized format

**Examples:**
```
Input: "APP123456"
Output: "s:9:\"APP123456\";"

Input: "SECRET_KEY_789"
Output: "s:14:\"SECRET_KEY_789\";"
```

#### 3. IV Generation
```typescript
const iv = crypto.randomBytes(16);
```

**Description:**
- Generates random 16-byte (128-bit) Initialization Vector
- Required for AES-256-CBC mode
- **Critical:** IV must be random for each encryption
- Prevents identical plaintexts from producing identical ciphertexts

#### 4. AES Encryption
```typescript
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update(serialized, "utf8", "base64");
encrypted += cipher.final("base64");
```

**Description:**
- **Algorithm:** AES-256-CBC
  - **AES:** Advanced Encryption Standard
  - **256:** 256-bit key size (32 bytes)
  - **CBC:** Cipher Block Chaining mode
- **Process:**
  1. `cipher.update()`: Encrypts data chunk by chunk
  2. `cipher.final()`: Encrypts remaining data with padding
  3. Output format: Base64 string

#### 5. HMAC Creation
```typescript
const mac = crypto
    .createHmac("sha256", key)
    .update(ivBase64 + encrypted)
    .digest("hex");
```

**Description:**
- **HMAC-SHA256:** Hash-based Message Authentication Code
- **Purpose:** Verify data integrity and authenticity
- **Input:** Concatenated IV (base64) + Encrypted data (base64)
- **Key:** Same encryption key
- **Output:** 64-character hex string

#### 6. JSON Packaging
```typescript
const json = JSON.stringify({
    iv: ivBase64,
    value: encrypted,
    mac: mac,
});
```

**Description:**
- Bundles all components into JSON object:
  - `iv`: Initialization Vector (base64)
  - `value`: Encrypted data (base64)
  - `mac`: HMAC signature (hex)

#### 7. Final Encoding
```typescript
return Buffer.from(json).toString("base64");
```

**Description:**
- Converts JSON string to base64
- Final result: Base64-encoded JSON containing encrypted data
- Safe for JSON/URL transport

### Example Output Structure

```json
{
    "iv": "Siuc0V4/epscdju/S3wanA==",
    "value": "K7BZ2mF8vQ3xR1nP9L6sA2cE5dF8hJ4kM7oP0qS3uV6w...",
    "mac": "a1b2c3d4e5f6789012345678901234567890abcdef123..."
}
```

**Encoded as Base64:**
```
eyJpdiI6IlNpdWMwVjQvcGVwc2NkanUvUzN3YW5BPT0iLCJ2YWx1ZSI6Iks3QloybUY4dlEzeFIxblA5TDZzQTJjRTV...
```

---

## decryptData Function

### Function Signature
```typescript
export const decryptData = (encryptedData: string) => any
```

### Process Flow

#### 1. Key Preparation
```typescript
const appKeyBase64 = config.APP_KEY;
const key = appKeyBase64.startsWith("base64:")
    ? Buffer.from(appKeyBase64.replace("base64:", ""), "base64")
    : Buffer.from(appKeyBase64, "utf8");
```

**Description:**
- Same key preparation as encryption
- Must use identical key for successful decryption

#### 2. Data Parsing
```typescript
const json = JSON.parse(
    Buffer.from(encryptedData, "base64").toString("utf8")
);
```

**Description:**
- Decodes base64 input to JSON string
- Parses JSON to extract encrypted components

#### 3. Component Extraction
```typescript
const iv = Buffer.from(json.iv, "base64");
const value = Buffer.from(json.value, "base64");
```

**Description:**
- Extracts IV from base64 format
- Extracts encrypted value from base64 format
- MAC is available in `json.mac` (not shown in code but can be used for verification)

#### 4. AES Decryption
```typescript
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
let decrypted = decipher.update(value, undefined, "utf8");
decrypted += decipher.final("utf8");
```

**Description:**
- Creates AES-256-CBC decipher with same key and IV
- Decrypts data back to serialized format
- Output: PHP-serialized string

#### 5. Deserialization
```typescript
return unserialize(decrypted);
```

**Description:**
- Converts PHP-serialized string back to original value
- Returns the original plaintext data

---

## Configuration

### Environment Variables

```bash
# Example .env configuration
APP_KEY="base64:YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY3ODk="
# or
APP_KEY="my_secret_32_character_key_here!"
```

### Key Requirements

- **Length:** Must be 32 bytes (256 bits) for AES-256
- **Format:** Support base64 or plain text
- **Security:** Should be cryptographically random
- **Storage:** Keep secret, never commit to version control

---

## Examples

### Basic Usage

```typescript
import { encryptData, decryptData } from '@helpers/encodeDecode';

// Encryption
const plaintext = "APP123456";
const encrypted = encryptData(plaintext);
console.log(encrypted);
// Output: "eyJpdiI6IlNpdWMwVjQvcGVwc2NkanUvUzN3YW5BPT0iLCJ2YWx1ZSI6Iks3Qlo..."

// Decryption
const decrypted = decryptData(encrypted);
console.log(decrypted);
// Output: "APP123456"
```

### JWT Token Usage

```typescript
// Creating JWT with encrypted payload
const credentials = {
    pid: partnership_id,
    str: timestamp,
    app: encryptData(appID),        // Encrypted sensitive data
    sck: encryptData(secretKey),    // Encrypted sensitive data
};

const token = jwt.sign(credentials, JWT_SECRET);

// Decoding JWT and decrypting data
const decoded = jwt.verify(token, JWT_SECRET);
const result = {
    partner_id: decoded.pid,
    app_id: decryptData(decoded.app),        // Decrypt to get original
    secret_key: decryptData(decoded.sck),    // Decrypt to get original
};
```

### Error Handling

```typescript
try {
    const encrypted = encryptData("sensitive_data");
    const decrypted = decryptData(encrypted);
} catch (error) {
    if (error.message.includes('Invalid key length')) {
        console.error('APP_KEY must be 32 bytes');
    } else if (error.message.includes('bad decrypt')) {
        console.error('Invalid encrypted data or wrong key');
    } else {
        console.error('Encryption/Decryption error:', error.message);
    }
}
```

---

## Security Considerations

### ✅ Security Benefits

1. **AES-256-CBC:** Industry-standard encryption algorithm
2. **Random IV:** Each encryption produces different output
3. **HMAC Verification:** Detects tampering and corruption
4. **Base64 Encoding:** Safe for JSON/URL transport
5. **PHP Serialization:** Consistent with Laravel ecosystem
6. **Key Flexibility:** Supports multiple key formats

### ⚠️ Security Warnings

1. **Key Management:**
   - Never hardcode encryption keys
   - Use environment variables or secure key management
   - Rotate keys periodically

2. **IV Security:**
   - IV is automatically randomized (good!)
   - IV is stored with encrypted data (acceptable)
   - Same IV must never be reused with same key

3. **HMAC Verification:**
   - Current implementation doesn't verify HMAC on decrypt
   - Consider adding HMAC verification for enhanced security

4. **Error Handling:**
   - Don't expose encryption errors to end users
   - Log security events for monitoring

### 🔧 Security Enhancements

Consider implementing these improvements:

```typescript
// Enhanced decryptData with HMAC verification
export const decryptDataSecure = (encryptedData: string) => {
    const key = getEncryptionKey();
    const json = JSON.parse(Buffer.from(encryptedData, "base64").toString("utf8"));
    
    // Verify HMAC before decryption
    const expectedMac = crypto
        .createHmac("sha256", key)
        .update(json.iv + json.value)
        .digest("hex");
    
    if (json.mac !== expectedMac) {
        throw new Error("HMAC verification failed - data may be corrupted");
    }
    
    // Proceed with decryption...
    const iv = Buffer.from(json.iv, "base64");
    const value = Buffer.from(json.value, "base64");
    
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(value, undefined, "utf8");
    decrypted += decipher.final("utf8");
    
    return unserialize(decrypted);
};
```

---

## Testing

### Unit Tests Example

```typescript
describe('Encryption/Decryption', () => {
    test('should encrypt and decrypt string correctly', () => {
        const original = "test_data_123";
        const encrypted = encryptData(original);
        const decrypted = decryptData(encrypted);
        
        expect(decrypted).toBe(original);
        expect(encrypted).not.toBe(original);
    });
    
    test('should produce different outputs for same input', () => {
        const data = "same_input";
        const encrypted1 = encryptData(data);
        const encrypted2 = encryptData(data);
        
        expect(encrypted1).not.toBe(encrypted2); // Due to random IV
    });
    
    test('should handle special characters', () => {
        const special = "Hello! @#$%^&*()_+{}|:<>?[];',./";
        const encrypted = encryptData(special);
        const decrypted = decryptData(encrypted);
        
        expect(decrypted).toBe(special);
    });
});
```

---

## Performance Considerations

- **CPU Usage:** AES encryption is computationally intensive
- **Memory:** Each encryption creates new buffers and strings
- **Size Overhead:** Encrypted data is ~33% larger due to base64 encoding
- **Caching:** Consider caching frequently encrypted values

---

## Troubleshooting

### Common Issues

1. **"Invalid key length" error**
   - Check APP_KEY is exactly 32 bytes
   - Verify base64 format if using base64: prefix

2. **"bad decrypt" error**
   - Wrong encryption key
   - Corrupted encrypted data
   - Modified IV or encrypted value

3. **"Unexpected token" error**
   - Invalid base64 input
   - Corrupted JSON structure

### Debug Tips

```typescript
// Debug encryption key
console.log('Key length:', Buffer.from(config.APP_KEY.replace('base64:', ''), 'base64').length);

// Debug encrypted structure
const encrypted = encryptData("test");
const parsed = JSON.parse(Buffer.from(encrypted, 'base64').toString('utf8'));
console.log('Encrypted structure:', {
    ivLength: parsed.iv.length,
    valueLength: parsed.value.length,
    macLength: parsed.mac.length
});
```

---

*Last updated: October 17, 2025*