import { serve } from "bun";
import index from "./index.html";
import { tailwindToRGB } from "./lib/colors";
import { publishMQTT } from "./lib/mqtt";

type Cell = {
  color: string;
};

type SpriteRequest = {
  width: number;
  height: number;
  grid: Cell[][];
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(_req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(_req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/sprite": {
      async POST(req) {
        try {
          const body = (await req.json()) as SpriteRequest;
          const { width, height, grid } = body;

          // Validate dimensions
          if (
            !width ||
            !height ||
            !grid ||
            grid.length !== height ||
            grid[0]?.length !== width
          ) {
            return Response.json(
              { success: false, error: "Invalid grid dimensions" },
              { status: 400 },
            );
          }

          // Convert grid to RGB byte array
          const pixels: number[] = [];
          for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
              const cell = grid[row]?.[col];
              if (!cell) {
                return Response.json(
                  { success: false, error: "Invalid grid data" },
                  { status: 400 },
                );
              }

              const rgb = tailwindToRGB(cell.color);
              if (rgb) {
                pixels.push(...rgb);
              } else {
                // bg-base-300 (transparent) - use black as default
                pixels.push(0, 0, 0);
              }
            }
          }

          // Create binary message: [width, height, ...rgb_bytes]
          const message = new Uint8Array([width, height, ...pixels]);

          // Get MQTT configuration from environment
          const broker = process.env.MQTT_BROKER || "localhost";
          const port = Number.parseInt(process.env.MQTT_PORT || "1883");
          const topic = process.env.MQTT_SPRITE_TOPIC || "unicorn/sprite";

          // Publish to MQTT broker
          await publishMQTT(broker, port, topic, message);

          return Response.json({ success: true });
        } catch (error) {
          console.error("Error sending sprite:", error);
          return Response.json(
            {
              success: false,
              error:
                error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          );
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
