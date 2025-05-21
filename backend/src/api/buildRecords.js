import express from "express";
import db from "../firebase-admin-setup.js";
const router = express.Router();

// Get all build records
router.get("/", async (req, res) => {
  const snapshot = await db.collection("buildRecords").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// Add a build record
router.post("/", async (req, res) => {
  const docRef = await db.collection("buildRecords").add(req.body);
  res.json({ id: docRef.id });
});

// Update a build record
router.put("/:id", async (req, res) => {
  await db.collection("buildRecords").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Delete a build record
router.delete("/:id", async (req, res) => {
  await db.collection("buildRecords").doc(req.params.id).delete();
  res.json({ success: true });
});

export default router; 