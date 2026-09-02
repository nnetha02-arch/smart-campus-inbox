# SmartCampus — Campus Complaint & Resolution System (MVP)

A full-stack complaint management system for colleges: students report issues,
admins assign them to departments/staff, staff resolve them, students track
status and give feedback.

Includes the "smart" starter features from the plan:
- **Automatic department routing** by complaint category
- **Keyword-based priority detection** (e.g. "exposed wire" → High)
- **Auto-generated complaint IDs** (CMP1001, CMP1002, ...)
- **Photo upload** on complaints and on resolution proof
- **Analytics** (totals + breakdown by category) on the admin dashboard

## Stack
- Frontend: React (Vite) + React Router + Axios
- Backend: Node.js + Express
- Database: MongoDB (use MongoDB Atlas — free tier is fine)
- Auth: JWT + bcrypt password hashing

## Folder structure
```
smart-campus/
├── backend/     Express API, MongoDB models, JWT auth
└── frontend/    React app (Vite)
```

## 1. Set up MongoDB
Create a free cluster at https://www.mongodb.com/cloud/atlas, create a database
user, and grab the connection string. It looks like:
```
mongodb+srv://<user>:<password>@cluster0.mongodb.net/smart-campus
```

## 2. Run the backend
```bash
cd backend
cp .env.example .env
# edit .env and paste your MONGO_URI + set a random JWT_SECRET
npm install
npm run dev
```
The API runs at `http://localhost:5000`. Test it by visiting
`http://localhost:5000` in a browser — you should see a JSON welcome message.

## 3. Run the frontend
In a **new terminal**:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
The app runs at `http://localhost:5173`.

## 4. Try it out
1. Go to `http://localhost:5173/register`, create a **student** account.
2. Log in, click **New Complaint**, submit something like:
   - Title: "Fan not working"
   - Description: "The ceiling fan in the room has stopped working"
   - Category: Electrical
   - Location: Block A - Room 204
3. To act as **admin**, you currently need to create one manually (public
   registration only allows student/staff — this is intentional for security).
   Easiest way: register as a student, then in MongoDB Atlas's "Collections"
   browser, edit that user's `role` field from `student` to `admin`.
4. Log back in as that user — you'll land on the Admin Dashboard, see the
   complaint, and can change its priority.
5. To test the **staff** flow: register a staff account, then in the DB set
   its `department` field to match the complaint's assigned department
   (or just view `/staff` — the staff route currently matches complaints by
   `assignedTo` or `departmentId` query, see note below).

## Notes on what's simplified in this MVP (next steps)
- **Staff assignment UI**: the admin dashboard currently lets you change
  priority. Wiring up a dropdown to assign a specific staff member (using the
  `PUT /api/complaints/:id/assign` endpoint with `assignedTo`) is a natural
  next step — the backend already supports it.
- **Notifications**: not implemented yet. Could add email (Nodemailer) or
  in-app notifications stored per user.
- **AI classification / duplicate detection**: the plan's "AI feature for
  SIH" is not built yet. A good next step is calling an LLM API (or a simple
  keyword/embedding similarity check) in `createComplaint` to suggest
  category/priority and flag likely duplicates before saving.
- **Image storage**: currently saved to local disk (`backend/uploads/`). For
  production/deployment (e.g. Render), swap to Cloudinary or Firebase Storage
  since most hosts don't persist local disk writes.

## API summary
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/complaints            (student, multipart with "image")
GET    /api/complaints/mine       (student)
GET    /api/complaints            (admin, ?status=&category=&priority=)
GET    /api/complaints/stats      (admin)
GET    /api/complaints/assigned   (staff)
GET    /api/complaints/:id
PUT    /api/complaints/:id/assign (admin — body: assignedTo, assignedDepartment, priority)
PUT    /api/complaints/:id/status (staff — body: status, resolutionNote; multipart "proofImage")

GET    /api/departments
POST   /api/departments           (admin)
GET    /api/departments/:id/staff (admin)

POST   /api/feedback              (student)
GET    /api/feedback/:complaintId
```
