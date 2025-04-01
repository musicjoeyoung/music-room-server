import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";

import { Hono } from "hono";
import { drizzle } from "drizzle-orm/neon-http";
import { instrument } from "@fiberplane/hono-otel";
import { neon } from "@neondatabase/serverless";
import { users } from "./db/schema";

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Honc! 🪿");
});

app.get("/api/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  return c.json({
    users: await db.select().from(users),
  });
});

app.post("/api/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { username, password, email, firstName, lastName, displayName, bio } = await c.req.json();
  const newUser = {
    username,
    password,
    email,
    firstName,
    lastName,
    displayName,
    bio,
  };
  try {
    const result = await db.insert(users).values(newUser).returning();
    return c.json(result);

  } catch (error) {
    console.error("ERROR", error)
  }
});

/**
 * Serve a simplified api specification for your API
 * As of writing, this is just the list of routes and their methods.
 */
app.get("/openapi.json", c => {
  // @ts-expect-error - @fiberplane/hono is in beta and still not typed correctly
  return c.json(createOpenAPISpec(app, {
    openapi: "3.0.0",
    info: {
      title: "Honc D1 App",
      version: "1.0.0",
    },
  }))
});

/**
 * Mount the Fiberplane api explorer to be able to make requests against your API.
 * 
 * Visit the explorer at `/fp`
 */
app.use("/fp/*", createFiberplane({
  app,
  openapi: { url: "/openapi.json" }
}));

export default app;

// Export the instrumented app if you've wired up a Fiberplane-Hono-OpenTelemetry trace collector
//
// export default instrument(app);
