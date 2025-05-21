import express from "express";
import db from "../firebase-admin-setup.js";
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  const snapshot = await db.collection("users").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// Add a user
router.post("/", async (req, res) => {
  const docRef = await db.collection("users").add(req.body);
  res.json({ id: docRef.id });
});

// Update a user
router.put("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Delete a user
router.delete("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();
  res.json({ success: true });
});

export default router; 