import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seed } from "./lib/seed.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, async () => {
  logger.info({ port }, "Server listening");
  try {
    await seed();
  } catch (err) {
    logger.error({ err }, "Seeding failed");
  }
});
