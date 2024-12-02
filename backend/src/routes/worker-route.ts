import { query } from "../db/db-connection";
import type { FastifyInstance } from "fastify";
import type { Worker, WorkerParam } from "../interfaces/worker-interface";

const workerRoute = async (app: FastifyInstance) => {
  app.post<{ Body: Worker }>("/createWorker", async (request, reply) => {
    const { nome, cargo, telefone, telefone_emergencia, tipo_sanguineo } = request.body;

    const text = `
            INSERT INTO worker (nome, cargo, telefone, telefone_emergencia, tipo_sanguineo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
    const values = [nome, cargo, telefone, telefone_emergencia, tipo_sanguineo];

    try {
      const result = await query(text, values);
      reply.code(201).send(result.rows[0]);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao criar funcinário" });
    }
  });
  app.get("/getAllworkers", async (request, reply) => {
    try {
      const text = `
            SELECT * FROM worker
        `;
      const result = await query(text);
      reply.send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ error: "Erro ao buscar funcinários" });
    }
  });

  app.get("/getAllNameWorkers", async (request, reply) => {
    try {
      const text = `
            SELECT nome FROM worker
        `;
      const resultName = await query(text);
      reply.send(resultName.rows);
    } catch (err) {
      reply.code(500).send({ error: "Erro ao buscar funcionários" });
    }
  });
  app.get<{ Params: WorkerParam }>("/getWorker/:name", async (request, reply) => {
    const { nome } = request.params;
    try {
      const text = `
            SELECT * FROM worker where nome = $1
        `;
      const result = await query(text, [nome]);
      reply.send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ error: "Erro ao buscar funcinário" });
    }
  });
};

export default workerRoute;
