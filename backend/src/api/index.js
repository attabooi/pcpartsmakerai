import express from "express";
import cors from "cors";
import componentsRouter from "./components.js";
import usersRouter from "./users.js";
import tierListsRouter from "./tierLists.js";
import buildRecordsRouter from "./buildRecords.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/components", componentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/tierlists", tierListsRouter);
app.use("/api/buildrecords", buildRecordsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
}); 