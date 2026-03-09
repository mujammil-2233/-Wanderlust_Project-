# Wanderlust (MajorProject)

This is a simple Node + Express + MongoDB CRUD app for listings.

Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally (default URL: `mongodb://127.0.0.1:27017/wanderlust`)

Setup
1. Open PowerShell and go to the project folder:

```powershell
cd 'C:\Users\Admin\Desktop\MajorProject Apna college'
```

2. Install dependencies:

```powershell
npm install
```

3. Seed the database with sample listings (optional — this will delete existing listings):

```powershell
npm run seed
```

Notes about image uploads
- The app now supports uploading images from the `new` and `edit` forms. Uploaded files are saved to `public/uploads` and served statically.
- You can still add image URLs in the form if you prefer not to upload files.

4. Start the server:

```powershell
npm start
```

5. Open the app in your browser:

http://localhost:8080/listings

Notes & Troubleshooting
- If MongoDB isn't running, the app will fail to start or the seed script will fail. Start MongoDB (e.g., `mongod`) or use MongoDB Desktop.
- To add images when creating/editing listings, provide image URLs in the form fields. The app supports up to 3 image URLs per listing.
- If you want file uploads or Cloudinary support, tell me and I will add it.

Next improvements I can make (ask me to run any):
- Add input validation and user-friendly error pages
- Add image upload support (multer or Cloudinary)
- Add tests using `supertest` and a basic CI configuration
- Add authentication and authorization

