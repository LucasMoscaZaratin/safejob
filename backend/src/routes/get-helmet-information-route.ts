import type { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import fastifyWebsocket from "@fastify/websocket";

dotenv.config();

interface ThingSpeakResponse {
  feeds: {
    field1: string;
    created_at: string;
  }[];
}

const getHelmetInformation = async (app: FastifyInstance) => {
  const THRESHOLD = 10; // Limite configurável para disparar o alerta
  app.register(fastifyWebsocket);

  app.get("/getHelmet", { websocket: true }, (connection, req) => {
    const sendData = async () => {
      try {
        const response = await fetch(
          `https://api.thingspeak.com/channels/${process.env.CHANNEL_ID}/fields/1.json?api_key=${process.env.API_KEY}&results=2`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Aqui usamos o tipo explicitamente para evitar o erro "unknown"
        const rawData = (await response.json()) as Partial<ThingSpeakResponse>;

        // Validação simples dos dados recebidos
        if (
          !rawData ||
          !Array.isArray(rawData.feeds) ||
          rawData.feeds.some((feed) => typeof feed.field1 !== "string" || typeof feed.created_at !== "string")
        ) {
          throw new Error("Invalid response format");
        }

        // Garantimos que os dados sejam do tipo correto após validação
        const data: ThingSpeakResponse = rawData as ThingSpeakResponse;

        const entries = data.feeds.map((entry) => {
          const [x, y, z] = entry.field1.split(",").map(Number);

          return {
            x: x || 0, // Tratar valores inválidos como 0
            y: y || 0,
            z: z || 0,
            timestamp: entry.created_at,
            alert: (x || 0) > THRESHOLD || (y || 0) > THRESHOLD || (z || 0) > THRESHOLD,
          };
        });

        // Envia os dados processados para o cliente
        connection.socket.send(JSON.stringify({ success: true, data: entries }));
      } catch (error) {
        console.error("Error fetching data:", error);
        connection.socket.send(JSON.stringify({ success: false, message: "Error fetching data" }));
      }
    };

    // Envia os dados a cada 15 segundos
    const intervalId = setInterval(sendData, 15000);

    connection.socket.on("close", () => {
      clearInterval(intervalId);
    });
  });
};

export default getHelmetInformation;
