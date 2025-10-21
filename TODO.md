# TODO: Add File Upload and Download for Resources

## Backend Changes ✅
- [x] Install multer package for file uploads
- [x] Update Resource model to support file uploads (filePath, fileName, fileSize, mimeType)
- [x] Create uploads directory for storing files
- [x] Update admin.js routes to handle file uploads with multer
- [x] Add file download endpoint
- [x] Update index.js to serve uploaded files statically
- [x] Add file validation and size limits (10MB)

## Frontend Changes ✅
- [x] Update AdminResources.tsx to support both URL and file uploads
- [x] Add file input with drag-and-drop support
- [x] Update Resources.tsx to fetch from backend and display uploaded files
- [x] Add download functionality for uploaded files
- [x] Add fallback to mock data if backend is unavailable

## Testing
- [ ] Test file upload functionality
- [ ] Test file download functionality
- [ ] Test URL resource links
- [ ] Test file size limits and validation
- [ ] Test admin resource management
