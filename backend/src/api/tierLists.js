import express from "express";
import db from "../firebase-admin-setup.js";
const router = express.Router();

// Get all tier lists
router.get("/", async (req, res) => {
  const snapshot = await db.collection("tierLists").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// Add a tier list
router.post("/", async (req, res) => {
  const docRef = await db.collection("tierLists").add(req.body);
  res.json({ id: docRef.id });
});

// Update a tier list
router.put("/:id", async (req, res) => {
  await db.collection("tierLists").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Delete a tier list
router.delete("/:id", async (req, res) => {
  await db.collection("tierLists").doc(req.params.id).delete();
  res.json({ success: true });
});

export default router; 