## Mongoose quick reference — what it is and how we use it here

Mongoose is an ODM (Object Document Mapper) library for MongoDB and Node.js. It provides:

- Schema definitions and validation for collections.
- Model classes you can query (find, findOne, findById, etc.).
- Middleware hooks (pre/post) and instance/static methods.
- Helpers like .populate() to resolve ObjectId refs.

In this project Mongoose is used to:

- Define domain schemas (Doctor, Patient, Appointment, Message).
- Enforce small enums/defaults (appointment status/mode, message type).
- Provide instance methods (password compare).
- Query and mutate data in Express controllers (controllers call .find/.save/.populate, etc.).
- Transform payloads for the frontend (Message.toJSON transform).

Contract (tiny)

- Inputs: Express request data (params/body/queries) mapped to Mongoose queries and model instances.
- Outputs: JSON results (documents or lists) returned to frontend; socket emissions use saved documents.
- Error modes: validation errors (schema), missing documents (404), DB connectivity errors (500).

Edge cases to keep in mind

- Older DB documents can miss recently-added fields (e.g., Appointment.status) → code should defensively handle undefined.
- ObjectId vs string comparisons (frontend IDs must be stringified before comparing to DB \_id).
- Text-only messages must be sent as JSON (backend expects req.body.text) — multipart requests must include text explicitly.
- Password hashing is done in pre('save') hooks; ensure you call .save() to trigger them.

---

## Project-specific mapping of Mongoose usage (file → operation → role)

Below is a concise map of where the main Mongoose functions and patterns are used in this repo and what each usage does in the project context.

Models & schema notes

- `backend/src/models/Doctor.js`

  - `new mongoose.Schema(...)` — schema for doctors (fields: name, email, password, specialization, schedule, avatar, ...).
  - `doctorSchema.pre('save', ...)` — hashes password before saving.
  - `doctorSchema.methods.comparePassword` — instance method to compare plain password with hashed password.
  - `mongoose.model('Doctor', doctorSchema)` — Doctor model export.

- `backend/src/models/Patient.js`

  - `patientSchema.pre('save', ...)` — hashes password before saving.
  - `patientSchema.methods.comparePassword` — password compare instance method.
  - `mongoose.model('Patient', patientSchema)` — Patient model export.

- `backend/src/models/Appointment.js`

  - `appointmentSchema` — fields, enums and defaults (status default `'pending'`, mode default `'chat'`).
  - Indexes created for doctorId/patientId (improves query perf).
  - `mongoose.model('Appointment', appointmentSchema)` — Appointment model export.

- `backend/src/models/Message.js`
  - `messageSchema` — fields: senderId, receiverId (ObjectId refs), text, image, read, type.
  - `toJSON.transform` — converts createdAt to ISO string for consistent frontend format.
  - `mongoose.model('Message', messageSchema)` — Message model export.

Find / Query operations (read)

- `backend/src/controllers/appointmentController.js`:

  - `Appointment.find(...)` — list appointments; often chained with `.populate('doctorId', 'name specialization')` and `.populate('patientId', 'name')` to include related user fields.
  - `Appointment.findById(req.params.id)` — load a single appointment for viewing/updating; sometimes `appointment.populate(...)` is used to populate after loading.
  - Purpose: fetch appointments for dashboard, patient views and doctor views; populate resolves doctor/patient details so frontend has displayable names and metadata.

- `backend/src/controllers/doctorController.js`:

  - `Doctor.find()` — list all doctors for directory.
  - `Doctor.findById(id)` — get a single doctor's full profile.
  - Purpose: doctor lookup and list pages.

- `backend/src/controllers/patientController.js`:

  - `Patient.find().select('-password')` — get patient lists (excluding password).
  - `Patient.findById(req.params.id).select('-password')` — get a single patient profile for display/edit (password omitted).
  - Purpose: patient profile endpoints and admin-like listings.

- `backend/src/controllers/messageController.js`:

  - `Message.find({ $or: [...] }).sort({ createdAt: 1 })` — fetch all messages between two users in chronological order.
  - `Patient.findById(id).select('-password')` / `Doctor.findById(id).select('-password')` — used to resolve a user id to a displayable user when the other type may exist.
  - Purpose: powering the chat history view; sorting ensures the frontend renders messages in time order.

- `backend/src/controllers/authController.js`:

  - `Doctor.findOne({ email })`, `Patient.findOne({ email })`, `UserModel.findOne({ email })` — check for existing users and for login lookup.

- `backend/src/middleware/auth.js`:
  - `Patient.findById(userId)` / `Doctor.findById(userId)` — load authenticated user for request context (req.user).

Create / Save operations (write)

- `backend/src/controllers/authController.js`:

  - `const user = new UserModel({...}); await user.save()` — register user; triggers pre('save') password hashing.

- `backend/src/controllers/doctorController.js`:

  - `await doctor.save()` — update doctor profile (saves any modified fields).

- `backend/src/controllers/patientController.js`:

  - `await patient.save()` — update patient profile.

- `backend/src/controllers/appointmentController.js`:

  - `const appointment = new Appointment({...}); const savedAppointment = await appointment.save()` — create new appointment.
  - `appointment.save()` — update status/comments after mutating the appointment instance.
  - After save, `.populate(...)` is often used to return a populated object.

- `backend/src/controllers/messageController.js`:
  - `const newMessage = new Message({ senderId, receiverId, text, image, type }); await newMessage.save();` — persist chat messages; saved document is returned to frontend and emitted to sockets.

Update patterns

- Pattern: load a document with `findById()`, change fields on the instance, then `await doc.save()` to persist (used in appointment & profile updates). This ensures pre/post hooks run and instance methods remain available.

Delete operations

- `doctorController.js`, `patientController.js`, `appointmentController.js`
  - `await doctor.deleteOne()`, `await patient.deleteOne()`, `await appointment.deleteOne()` — remove documents.
  - Purpose: standard "delete" endpoints.

Populate / select usage

- `.populate('doctorId', 'name specialization')` / `.populate('patientId', 'name')`
  - Used a lot in appointment endpoints to return human-friendly embedded fields instead of raw ObjectIds.
- `.select('-password')`
  - Used when returning user documents to avoid leaking hashed password fields.

Schema methods & hooks (important behavioral pieces)

- `pre('save')` hooks in `Doctor` and `Patient`:
  - Hash passwords automatically on save. If a controller directly uses `Model.updateOne(...)` it would bypass pre('save') — the code uses instance `.save()` so hashing triggers correctly.
- `doctorSchema.methods.comparePassword` and `patientSchema.methods.comparePassword`:
  - Used during login to validate credentials.

Indexing & performance

- Indexes declared in Appointment schema (doctorId/patientId + dateTime) to speed up appointment lookups by doctor/patient + date.

Special queries and semantics

- Message query with `$or` (in `messageController.js`) fetches messages where (senderId=A and receiverId=B) OR (senderId=B and receiverId=A) — returns full conversation.
- Sorting (`.sort({ createdAt: 1 })`) ensures messages are chronological.

Transformations & formatting

- Message schema `toJSON.transform` normalizes createdAt to ISO string for consistent front-end consumption.

---

## Practical notes / quick recommendations

- When updating documents and relying on pre('save') hooks, prefer the pattern: load via `findById()`, mutate fields on the returned instance, then `await instance.save()` (this repo follows that pattern).
- If you ever need to perform bulk updates without triggering hooks, be explicit and add separate hashing or validation logic; be aware updateOne/updateMany bypass pre('save').
- Migrations: some older Appointment documents may lack `status` or `mode` fields. Consider a one-off script to fill defaults:
  - e.g. set missing `status` to `'pending'` and missing `mode` to `'chat'`. This reduces the need for defensive checks in rendering code.
- ID comparisons: always compare as strings (String(doc.\_id) or doc.\_id.toString()) when matching with frontend user IDs (strings). This prevents subtle chat delivery/visibility bugs.

---

## Where to look for these operations in the codebase (quick file list)

- Models (schema + methods/hooks)

  - `backend/src/models/Doctor.js` — pre('save'), comparePassword
  - `backend/src/models/Patient.js` — pre('save'), comparePassword
  - `backend/src/models/Appointment.js` — schema + defaults + indexes
  - `backend/src/models/Message.js` — message schema + toJSON transform

- Controllers (queries & mutations)

  - `backend/src/controllers/authController.js` — findOne, save
  - `backend/src/controllers/doctorController.js` — find, findById, save, deleteOne
  - `backend/src/controllers/patientController.js` — find, findById, save, deleteOne, .select('-password')
  - `backend/src/controllers/appointmentController.js` — Appointment.find, findById, populate, save, deleteOne
  - `backend/src/controllers/messageController.js` — Message.find({ $or: [...] }).sort(...), new Message().save(), Doctor/Patient findById for resolving participants

- Middleware
  - `backend/src/middleware/auth.js` — Patient.findById / Doctor.findById to attach req.user

---

If you’d like, I can:

- Produce a one-off migration script (Node script) that sets missing Appointment.status/mode defaults and run it locally.
- Add short unit tests around controllers (mocking Mongoose) to lock behavior (especially message fetching and appointment defaults).
- Generate a short visual schema (diagram) of the model relations (Doctor/Patient ↔ Appointment, Message relations). Which would help for documentation or interviews?
