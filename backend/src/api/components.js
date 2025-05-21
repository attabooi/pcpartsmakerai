import express from "express";
import db from "../firebase-admin-setup.js";
const router = express.Router();

// Get all components
router.get("/", async (req, res) => {
  const snapshot = await db.collection("components").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// Add a component
router.post("/", async (req, res) => {
  const docRef = await db.collection("components").add(req.body);
  res.json({ id: docRef.id });
});

// Update a component
router.put("/:id", async (req, res) => {
  await db.collection("components").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Delete a component
router.delete("/:id", async (req, res) => {
  await db.collection("components").doc(req.params.id).delete();
  res.json({ success: true });
});

export default router; 