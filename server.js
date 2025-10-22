import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

app.get("/token", async (req, res) => {
  try {
    const { room, userId, isHost } = req.query;
    if (!room || !userId) return res.status(400).send("room and userId required");

    const at = new AccessToken(API_KEY, API_SECRET, { identity: userId });
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: isHost === "true",
      canSubscribe: true,
    });

    const token = await at.toJwt(); // <-- await added
    console.log("Generated token:", token);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating token");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Token server running on port ${PORT}`));
