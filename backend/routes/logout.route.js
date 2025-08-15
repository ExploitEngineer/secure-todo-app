import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.cookie("token", "");
  res.status(200).send({
    message: "Logged out successfully",
  });
});

export default router;
