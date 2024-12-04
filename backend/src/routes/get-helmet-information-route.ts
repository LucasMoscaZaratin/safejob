import type { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import fastifyWebsocket from "@fastify/websocket";
import WebSocket from "ws"; // Importando o WebSocket do pacote 'ws'

dotenv.config();

interface ThingSpeakResponse {
  feeds: {
    field1: string;
    field2: string;
    field3: string;
    created_at: string;
  }[];
}

const getHelmetInformation = async (app: FastifyInstance) => {
  const THRESHOLD = 2; // Limite para ativar alertas
  app.register(fastifyWebsocket);

  app.get("/getImpact", { websocket: true }, (connection, req) => {
    console.log("WebSocket connection established.");

    const sendData = async () => {
      try {
        const response = await fetch(
          "https://api.thingspeak.com/channels/2659640/feeds.json?api_key=ZOVY9Q2L9XDVM9DH&results=3"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rawData = (await response.json()) as Partial<ThingSpeakResponse>;

        // Verificar se os dados recebidos têm o formato esperado
        if (
          !rawData ||
          !Array.isArray(rawData.feeds) ||
          rawData.feeds.some(
            (feed) =>
              typeof feed.field1 !== "string" ||
              typeof feed.field2 !== "string" ||
              typeof feed.field3 !== "string" ||
              typeof feed.created_at !== "string"
          )
        ) {
          throw new Error("Invalid response format");
        }

        const data: ThingSpeakResponse = rawData as ThingSpeakResponse;

        // biome-ignore lint/complexity/noForEach: <explanation>
        data.feeds.forEach((entry) => {
          const x = Number.parseFloat(entry.field1) || 0;
          const y = Number.parseFloat(entry.field2) || 0;
          const z = Number.parseFloat(entry.field3) || 0;

          // Associar MAC Address (ou outro identificador único) aos dados
          const macAddress = entry.created_at;

          // Verificar se qualquer valor excede o limite definido
          const alert = x > THRESHOLD || y > THRESHOLD || z > THRESHOLD;

          // Verificar se a conexão WebSocket ainda está aberta
          if (connection.readyState === WebSocket.OPEN) {
            connection.send(
              JSON.stringify({
                success: true,
                macAddress,
                x,
                y,
                z,
                timestamp: entry.created_at,
                alert,
              })
            );
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);

        if (connection.readyState === WebSocket.OPEN) {
          connection.send(
            JSON.stringify({
              success: false,
              message: "Error fetching data",
            })
          );
        }
      }
    };

    // Configurar envio periódico dos dados
    const intervalId = setInterval(sendData, 15000);

    // Limpar intervalo ao desconectar
    connection.onclose = () => {
      console.log("WebSocket connection closed.");
      clearInterval(intervalId);
    };

    // Garantir que a conexão seja fechada corretamente
    connection.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  });
};

export default getHelmetInformation;
