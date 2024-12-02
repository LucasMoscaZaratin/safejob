import { query } from "../db/db-connection";
import type { FastifyInstance } from "fastify";
import type { Helmet } from "../interfaces/helmet-interface";

const helmetRoute = async (app: FastifyInstance) => {
  app.get("/getHelmet", async (request, reply) => {
    try {
      const text = `
      SELECT * FROM helmet`;
      const result = await query(text);
      const helmets = result.rows.map((helmet) => {
        return {
          ...helmet,
          status: helmet.status ? "Ativo" : "Desativo",
        };
      });

      reply.send(helmets);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao buscar capacetes" });
    }
  });
  app.get("/getSetor", async (request, reply) => {
    try {
      const text = `
      SELECT nome_setor FROM tipos_setores`;
      const result = await query(text);
      reply.send(result.rows);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao buscar os setores" });
    }
  });

  app.post<{ Body: Helmet }>("/createHelmet", async (request, reply) => {
    const { user_name, setor } = request.body;

    try {
      const text = `
        INSERT INTO helmet (user_name, setor)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [user_name, setor];
      const result = await query(text, values);
      reply.code(201).send({ message: "Usuario criado com sucesso", user: result.rows[0] });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Erro ao cadastrar capacete" });
    }
  });
};

export default helmetRoute;
