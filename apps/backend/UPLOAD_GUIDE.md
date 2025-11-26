# File Upload Guide

All file uploads are handled by **Cloudflare R2** (no local storage). Files are organized in a structured directory hierarchy.

## Upload Endpoints

All upload endpoints are protected by authentication guards and use `multipart/form-data` encoding.

### 1. Product Images (`/upload/product-image`)

**Auth**: Vendor only
**Method**: POST
**Body**:
- `file`: Image file (JPEG, PNG, WebP)
- `vendorSlug`: Vendor slug (e.g., "johns-pizza")
- `productSlug`: Product slug (e.g., "pepperoni-pizza")

**Path**: `products/{vendor-slug}/{product-slug}/{timestamp}-{uuid}.ext`

**Example**:
```bash
curl -X POST http://localhost:3000/upload/product-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@pizza.jpg" \
  -F "vendorSlug=johns-pizza" \
  -F "productSlug=pepperoni-pizza"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://doorstep.your-domain.com/products/johns-pizza/pepperoni-pizza/1234567890-abc123.jpg",
    "key": "products/johns-pizza/pepperoni-pizza/1234567890-abc123.jpg"
  }
}
```

---

### 2. Vendor Logo (`/upload/vendor-logo`)

**Auth**: Vendor only
**Method**: POST
**Body**:
- `file`: Image file (JPEG, PNG, WebP)
- `vendorSlug`: Vendor slug

**Path**: `vendors/{vendor-slug}/logo/{timestamp}-{uuid}.ext`

**Example**:
```bash
curl -X POST http://localhost:3000/upload/vendor-logo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@logo.png" \
  -F "vendorSlug=johns-pizza"
```

---

### 3. User Avatar (`/upload/avatar`)

**Auth**: All authenticated users
**Method**: POST
**Body**:
- `file`: Image file (JPEG, PNG, WebP)

**Path**: `users/{userId}/avatar/{timestamp}-{uuid}.ext`

**Example**:
```bash
curl -X POST http://localhost:3000/upload/avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@avatar.jpg"
```

**Usage**: For customer, vendor, and stepper avatars/profile pictures.

---

### 4. Stepper Documents (`/upload/stepper-document`)

**Auth**: Stepper only
**Method**: POST
**Body**:
- `file`: Document file (PDF, JPEG, PNG)
- `documentType`: Type of document (e.g., "id", "license", "student-id")

**Path**: `steppers/{userId}/documents/{documentType}/{timestamp}-{uuid}.ext`

**Example**:
```bash
curl -X POST http://localhost:3000/upload/stepper-document \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@student-id.pdf" \
  -F "documentType=student-id"
```

**Document Types**:
- `student-id`: Student ID card
- `government-id`: Government-issued ID
- `license`: Driver's license (if applicable)
- `proof-of-vehicle`: Vehicle registration/ownership proof

---

### 5. Order Receipt (`/upload/order-receipt`)

**Auth**: Customer or Stepper
**Method**: POST
**Body**:
- `file`: Image file (JPEG, PNG, WebP)
- `orderId`: Order ID

**Path**: `orders/{orderId}/receipts/{timestamp}-{uuid}.ext`

**Example**:
```bash
curl -X POST http://localhost:3000/upload/order-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@receipt.jpg" \
  -F "orderId=clx123abc"
```

---

## File Restrictions

- **Max file size**: 5MB (configurable via `MAX_FILE_SIZE` env var)
- **Image types**: JPEG, JPG, PNG, WebP
- **Document types**: PDF, JPEG, JPG, PNG

---

## Frontend Integration

### React/Next.js Example

```typescript
async function uploadProductImage(vendorSlug: string, productSlug: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('vendorSlug', vendorSlug);
  formData.append('productSlug', productSlug);

  const response = await fetch('http://localhost:3000/upload/product-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result.data.url; // Use this URL in your product photoUrl field
}
```

### HTML Form Example

```html
<form id="upload-form">
  <input type="file" name="file" accept="image/*" required />
  <input type="hidden" name="vendorSlug" value="johns-pizza" />
  <input type="hidden" name="productSlug" value="pepperoni-pizza" />
  <button type="submit">Upload</button>
</form>

<script>
document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const response = await fetch('/upload/product-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${yourToken}`,
    },
    body: formData,
  });

  const result = await response.json();
  console.log('Uploaded:', result.data.url);
});
</script>
```

---

## DTO Field Mapping

After uploading files, save the returned URL to these fields:

### Product
- `photoUrl`: Use `/upload/product-image` endpoint

### Stepper Registration
- `studentIdUrl`: Use `/upload/stepper-document` with `documentType=student-id`
- `governmentIdUrl`: Use `/upload/stepper-document` with `documentType=government-id`
- `pictureUrl`: Use `/upload/avatar` endpoint

### Vendor (Future)
- Add `logoUrl` field to vendor schema
- Use `/upload/vendor-logo` endpoint

### Customer/User
- Use `/upload/avatar` for profile pictures

---

## Configuration

Ensure these environment variables are set in `.env`:

```bash
# Cloudflare R2 Storage
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY=your_access_key
CLOUDFLARE_SECRET_KEY=your_secret_key
R2_BUCKET_NAME=doorstep
ASSETS_PUBLIC_BASE_URL=https://doorstep.your-domain.com

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

---

## R2 Bucket Structure

```
doorstep/
├── products/
│   └── {vendor-slug}/
│       └── {product-slug}/
│           └── {timestamp}-{uuid}.ext
├── vendors/
│   └── {vendor-slug}/
│       └── logo/
│           └── {timestamp}-{uuid}.ext
├── users/
│   └── {userId}/
│       └── avatar/
│           └── {timestamp}-{uuid}.ext
├── steppers/
│   └── {userId}/
│       └── documents/
│           ├── student-id/
│           │   └── {timestamp}-{uuid}.ext
│           ├── government-id/
│           │   └── {timestamp}-{uuid}.ext
│           └── license/
│               └── {timestamp}-{uuid}.ext
└── orders/
    └── {orderId}/
        └── receipts/
            └── {timestamp}-{uuid}.ext
```

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/webp",
  "error": "Bad Request"
}
```

Common errors:
- **400 Bad Request**: Invalid file type, file too large, missing parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have permission for this upload type

---

## Testing Upload Status

Check if R2 is configured:

```bash
POST /upload/status

Response:
{
  "configured": true,
  "message": "Upload service is ready"
}
```
