"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../db/db-connection");
const pdfkit_1 = __importDefault(require("pdfkit"));
const relatorioRoute = async (app) => {
    app.get("/generateReport", async (_request, reply) => {
        try {
            const text = `
        SELECT * FROM notification
      `;
            const result = await (0, db_connection_1.query)(text);
            const notifications = result.rows;
            const tableNotification = generateNotificationTable(notifications);
            const doc = new pdfkit_1.default({ margin: 30, size: "A4" });
            createPDF(doc, tableNotification);
            const pdfBuffer = await getPDFBuffer(doc);
            sendPDF(reply, pdfBuffer);
        }
        catch (err) {
            console.error(err);
            reply.code(500).send({ error: "Erro ao buscar notificações" });
        }
    });
    const generateNotificationTable = (notifications) => {
        return {
            title: "Relatório de Incidentes",
            headers: [
                { label: "ID", property: "id", width: 50 },
                { label: "Data", property: "dia", width: 80 },
                { label: "Hora", property: "hora", width: 80 },
                { label: "Local", property: "localizacao", width: 100 },
                { label: "Incidente", property: "type", width: 120 },
                { label: "Funcionário", property: "user_name", width: 100 },
            ],
            datas: notifications.map((notification) => ({
                id: notification.id,
                dia: new Date(notification.dia).toLocaleDateString(),
                hora: notification.hora,
                localizacao: notification.localizacao,
                type: notification.type,
                user_name: notification.user_name,
            })),
        };
    };
    const createPDF = (doc, tableNotification) => {
        try {
            doc.fontSize(16).text(tableNotification.title, { align: "center" });
            doc.moveDown(2);
            const startX = 30;
            const startY = 100;
            let y = startY;
            doc.fontSize(12).font("Helvetica-Bold");
            let x = startX;
            for (const header of tableNotification.headers) {
                const width = header.width || 50;
                doc.text(header.label, x, y, { width, align: "left" });
                x += width;
            }
            y += 20;
            doc.font("Helvetica").fontSize(10);
            for (const dataRow of tableNotification.datas) {
                x = startX;
                for (const header of tableNotification.headers) {
                    const width = header.width || 50;
                    const text = dataRow[header.property]?.toString() || "";
                    doc.text(text, x, y, { width, align: "left" });
                    x += width;
                }
                y += 20;
            }
        }
        catch (error) {
            console.error("Erro ao criar o PDF:", error);
            throw error;
        }
    };
    const getPDFBuffer = (doc) => {
        return new Promise((resolve, reject) => {
            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
            doc.end();
        });
    };
    const sendPDF = (reply, pdfBuffer) => {
        reply
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", 'attachment; filename="Relatorio.pdf"')
            .send(pdfBuffer);
    };
};
exports.default = relatorioRoute;
//# sourceMappingURL=relatorio-route.js.map