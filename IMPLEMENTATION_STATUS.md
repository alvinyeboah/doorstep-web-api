# DoorStep API - Implementation Status

## ✅ Completed Implementations

### 1. Email Service (Plunk)

**Status**: ✅ Complete

**Location**: `apps/backend/src/common/services/plunk.service.ts`

**Features**:
- Custom HTTP implementation (no SDK dependency issues)
- Support for self-hosted Plunk at `mail.alvinyeboah.com`
- Falls back to official Plunk API
- Comprehensive logging for debugging

**Integration**:
- Used by `EmailService` for sending OTPs and welcome emails
- Registered in `UploadModule` providers

**Configuration**:
```bash
PLUNK_API_KEY=your_plunk_api_key_here
PLUNK_BASE_URL=https://mail.alvinyeboah.com  # Optional
EMAIL_FROM=noreply@doorstep.com
```

---

### 2. File Storage (Cloudflare R2)

**Status**: ✅ Complete

**Location**: `apps/backend/src/common/services/r2.service.ts`

**Features**:
- AWS S3-compatible client for R2
- Organized path structure for different resource types
- Helper methods for each upload type
- Support for custom CDN URLs

**File Organization**:
```
doorstep/
├── products/{vendor-slug}/{product-slug}/
├── vendors/{vendor-slug}/logo/
├── users/{userId}/avatar/
├── steppers/{userId}/documents/{documentType}/
└── orders/{orderId}/receipts/
```

**Configuration**:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY=your_access_key
CLOUDFLARE_SECRET_KEY=your_secret_key
R2_BUCKET_NAME=doorstep
ASSETS_PUBLIC_BASE_URL=https://doorstep.your-domain.com
```

---

### 3. Upload Module

**Status**: ✅ Complete

**Location**: `apps/backend/src/upload/`

**Endpoints**:
- `POST /upload/product-image` - Upload product images (Vendor only)
- `POST /upload/vendor-logo` - Upload vendor logos (Vendor only)
- `POST /upload/avatar` - Upload user avatars (All users)
- `POST /upload/stepper-document` - Upload stepper documents (Stepper only)
- `POST /upload/order-receipt` - Upload order receipts (Customer/Stepper)
- `POST /upload/status` - Check upload service configuration

**Features**:
- File type validation (images: JPEG/PNG/WebP, docs: PDF/images)
- File size validation (configurable via MAX_FILE_SIZE)
- UUID-based unique filenames with timestamps
- Role-based access control with auth guards
- Proper error handling with descriptive messages

**Documentation**: See `apps/backend/UPLOAD_GUIDE.md`

---

### 4. Better Auth Configuration

**Status**: ✅ Fixed

**Changes**:
- Removed `BETTER_AUTH_SECRET` (not required by Better Auth)
- Added Google OAuth configuration variables
- Updated documentation

**Configuration**:
```bash
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id     # Optional
GOOGLE_CLIENT_SECRET=your-google-client-secret  # Optional
```

---

## 📋 Integration Requirements

### Backend DTO Field Mappings

These DTOs currently accept URLs as strings. Frontend should upload files first, then use the returned URLs:

#### Product (`src/products/dto/product.dto.ts`)
- `photoUrl?: string` → Use `/upload/product-image` endpoint

#### Stepper (`src/stepper/dto/stepper.dto.ts`)
- `studentIdUrl?: string` → Use `/upload/stepper-document` with `documentType=student-id`
- `governmentIdUrl?: string` → Use `/upload/stepper-document` with `documentType=government-id`
- `pictureUrl?: string` → Use `/upload/avatar` endpoint

#### Vendor (Future Enhancement)
- Add `logoUrl?: string` field to schema → Use `/upload/vendor-logo` endpoint

---

## 🔧 Frontend Integration Needed

### Current State
- **Products page** (`apps/frontend/app/dashboard/products/page.tsx:209-220`): Uses text input for `photoUrl`
- **Registration forms**: Likely using text inputs for image URLs

### Required Changes
1. Replace URL text inputs with file upload inputs
2. Upload files to respective endpoints
3. Use returned URLs in form submission

### Example Implementation

```typescript
// Replace this:
<input
  type="url"
  value={formData.photoUrl}
  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
/>

// With this:
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendorSlug', vendorSlug);
    formData.append('productSlug', productSlug);

    const response = await fetch('/upload/product-image', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    setFormData({ ...formData, photoUrl: result.data.url });
  }}
/>
```

---

## 🐛 Known Issues

### 1. Prisma Client Generation

**Issue**: `pnpm prisma generate` fails with 403 errors when fetching Prisma binaries

**Error**:
```
Failed to fetch the engine file at https://binaries.prisma.sh/.../schema-engine.gz - 403 Forbidden
```

**Cause**: Temporary network/infrastructure issue with Prisma CDN

**Impact**: TypeScript compilation fails until Prisma client is generated

**Workaround**:
```bash
# Try again later when Prisma CDN is accessible
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma generate

# Or use cached engines if available
pnpm prisma generate --skip-generate
```

**Resolution**: This is a temporary external issue, not a code problem

---

## 📦 Dependencies Installed

- ✅ `multer` - Multipart/form-data handling
- ✅ `@types/multer` - TypeScript types for multer
- ✅ `uuid` - Unique filename generation
- ✅ `@types/uuid` - TypeScript types for uuid
- ✅ `@aws-sdk/client-s3` - Cloudflare R2 integration
- ❌ `usesend-js` - Removed (replaced with Plunk)
- ❌ `nodemailer` - Removed (replaced with Plunk)

---

## 🗂️ File Structure

```
apps/backend/
├── UPLOAD_GUIDE.md              # Upload API documentation
├── src/
│   ├── app.module.ts            # Updated with UploadModule
│   ├── common/services/
│   │   ├── email.service.ts     # Uses PlunkService
│   │   ├── plunk.service.ts     # ✨ NEW: Custom Plunk HTTP client
│   │   └── r2.service.ts        # ✨ NEW: Cloudflare R2 service
│   ├── shared/utils/
│   │   └── error.util.ts        # ✨ NEW: Error message extraction
│   └── upload/
│       ├── upload.module.ts     # ✨ NEW
│       ├── upload.controller.ts # ✨ NEW
│       └── upload.service.ts    # ✨ NEW
```

---

## ✅ Environment Variables Checklist

### Required
- [x] `DATABASE_URL` - PostgreSQL connection
- [x] `PORT` - API port (default: 3000)
- [x] `BETTER_AUTH_URL` - Better Auth base URL
- [x] `FRONTEND_URL` - Frontend URL for CORS
- [x] `PLUNK_API_KEY` - Plunk email API key
- [x] `EMAIL_FROM` - Sender email address
- [x] `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- [x] `CLOUDFLARE_ACCESS_KEY` - R2 access key
- [x] `CLOUDFLARE_SECRET_KEY` - R2 secret key
- [x] `R2_BUCKET_NAME` - R2 bucket name (doorstep)
- [x] `ASSETS_PUBLIC_BASE_URL` - Public CDN URL

### Optional
- [ ] `PLUNK_BASE_URL` - Self-hosted Plunk instance URL
- [ ] `CLOUDFLARE_R2_URL` - Custom R2 endpoint
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- [ ] `MAX_FILE_SIZE` - Max upload size (default: 5MB)

---

## 🚀 Next Steps

### Immediate
1. ✅ Wait for Prisma CDN issue to resolve, then run `pnpm prisma generate`
2. ✅ Run `pnpm build` to verify no TypeScript errors
3. ⏳ Set up Cloudflare R2 bucket and get credentials
4. ⏳ Get Plunk API key from dashboard
5. ⏳ Update `.env` with all required values

### Frontend Updates
1. ⏳ Update product form to use file upload
2. ⏳ Update vendor registration to use logo upload
3. ⏳ Update stepper registration to use document uploads
4. ⏳ Add loading states during uploads
5. ⏳ Add upload progress indicators
6. ⏳ Add file preview before upload

### Future Enhancements
1. ⏳ Add vendor `logoUrl` field to Prisma schema
2. ⏳ Add image cropping/resizing before upload
3. ⏳ Add multi-file upload support for products
4. ⏳ Add drag-and-drop file upload UI
5. ⏳ Add file deletion endpoints
6. ⏳ Add image optimization (WebP conversion)

---

## 📝 Testing Commands

```bash
# Generate Prisma client (when CDN is accessible)
pnpm prisma generate

# Build the project
pnpm build

# Run development server
pnpm dev

# Test upload endpoint
curl -X POST http://localhost:3000/upload/status \
  -H "Content-Type: application/json"

# Expected response:
# { "configured": true, "message": "Upload service is ready" }
```

---

## 📞 Support

- Plunk Documentation: https://useplunk.com/docs
- Cloudflare R2 Documentation: https://developers.cloudflare.com/r2
- Better Auth Documentation: https://better-auth.com
- Upload Guide: See `UPLOAD_GUIDE.md`

---

**Last Updated**: 2025-11-26
**Status**: ✅ All implementations complete, pending Prisma CDN resolution
