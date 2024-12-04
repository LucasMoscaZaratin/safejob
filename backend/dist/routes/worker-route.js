"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../db/db-connection");
const workerRoute = async (app) => {
    app.post("/createWorker", async (request, reply) => {
        const { nome, cargo, telefone, telefone_emergencia, tipo_sanguineo } = request.body;
        const text = `
            INSERT INTO worker (nome, cargo, telefone, telefone_emergencia, tipo_sanguineo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [nome, cargo, telefone, telefone_emergencia, tipo_sanguineo];
        try {
            const result = await (0, db_connection_1.query)(text, values);
            reply.code(201).send(result.rows[0]);
        }
        catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao criar funcinário" });
        }
    });
    app.get("/getAllworkers", async (request, reply) => {
        try {
            const text = `
            SELECT * FROM worker
        `;
            const result = await (0, db_connection_1.query)(text);
            reply.send(result.rows[0]);
        }
        catch (err) {
            reply.code(500).send({ error: "Erro ao buscar funcinários" });
        }
    });
    app.get("/getAllNameWorkers", async (request, reply) => {
        try {
            const text = `
            SELECT nome FROM worker
        `;
            const resultName = await (0, db_connection_1.query)(text);
            reply.send(resultName.rows);
        }
        catch (err) {
            reply.code(500).send({ error: "Erro ao buscar funcionários" });
        }
    });
    app.get("/getWorker/:name", async (request, reply) => {
        const { nome } = request.params;
        try {
            const text = `
            SELECT * FROM worker where nome = $1
        `;
            const result = await (0, db_connection_1.query)(text, [nome]);
            reply.send(result.rows[0]);
        }
        catch (err) {
            reply.code(500).send({ error: "Erro ao buscar funcinário" });
        }
    });
};
exports.default = workerRoute;
//# sourceMappingURL=worker-route.js.map