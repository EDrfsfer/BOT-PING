import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota raiz - página de status
  app.get("/", (_req, res) => {
    res.json({
      status: "online",
      message: "Bot Discord está rodando!",
      timestamp: new Date().toISOString(),
    });
  });

  // Rota de health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
