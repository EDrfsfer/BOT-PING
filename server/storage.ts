import { type MonitoredBot, type InsertMonitoredBot, type ResetLog } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOTS_FILE = path.join(DATA_DIR, "bots.json");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

export interface IStorage {
  // Bot operations
  getAllBots(): Promise<MonitoredBot[]>;
  getBot(id: string): Promise<MonitoredBot | undefined>;
  getBotByAccessCode(accessCode: string): Promise<MonitoredBot | undefined>;
  getBotByDiscordUserId(userId: string): Promise<MonitoredBot | undefined>;
  createBot(bot: InsertMonitoredBot): Promise<MonitoredBot>;
  updateBot(id: string, updates: Partial<MonitoredBot>): Promise<MonitoredBot | undefined>;
  deleteBot(id: string): Promise<boolean>;
  
  // Log operations
  addResetLog(log: Omit<ResetLog, "id">): Promise<ResetLog>;
  getResetLogs(limit?: number): Promise<ResetLog[]>;
}

export class MemStorage implements IStorage {
  private bots: Map<string, MonitoredBot>;
  private logs: ResetLog[];
  private initPromise: Promise<void> | null = null;
  private initialized: boolean = false;

  constructor() {
    this.bots = new Map();
    this.logs = [];
  }

  private async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      
      // Load bots
      try {
        const botsData = await fs.readFile(BOTS_FILE, "utf-8");
        const bots = JSON.parse(botsData) as MonitoredBot[];
        bots.forEach(bot => this.bots.set(bot.id, bot));
        console.log(`✅ Carregados ${bots.length} bot(s) do armazenamento`);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          // File doesn't exist, create it
          await this.save();
          console.log("📝 Arquivo de bots criado");
        } else {
          // File exists but can't be read or parsed - this is a critical error
          console.error("❌ Erro ao ler arquivo de bots:", err);
          throw new Error(`Falha ao carregar dados de bots: ${err.message}`);
        }
      }
      
      // Load logs
      try {
        const logsData = await fs.readFile(LOGS_FILE, "utf-8");
        this.logs = JSON.parse(logsData) as ResetLog[];
        console.log(`✅ Carregados ${this.logs.length} log(s) do armazenamento`);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          // File doesn't exist, create it
          await this.saveLogs();
          console.log("📝 Arquivo de logs criado");
        } else {
          // File exists but can't be read or parsed - this is a critical error
          console.error("❌ Erro ao ler arquivo de logs:", err);
          throw new Error(`Falha ao carregar logs: ${err.message}`);
        }
      }
    } catch (error) {
      console.error("❌ Erro fatal ao inicializar storage:", error);
      throw error;
    }
  }

  private async ensureInitialized() {
    if (this.initialized) return;
    
    if (!this.initPromise) {
      this.initPromise = this.init();
    }
    
    try {
      await this.initPromise;
      this.initialized = true;
    } catch (error) {
      // Reset promise so next call attempts re-init
      this.initPromise = null;
      throw error;
    }
  }

  private async save() {
    await fs.writeFile(
      BOTS_FILE,
      JSON.stringify(Array.from(this.bots.values()), null, 2)
    );
  }

  private async saveLogs() {
    await fs.writeFile(
      LOGS_FILE,
      JSON.stringify(this.logs, null, 2)
    );
  }

  async getAllBots(): Promise<MonitoredBot[]> {
    await this.ensureInitialized();
    return Array.from(this.bots.values());
  }

  async getBot(id: string): Promise<MonitoredBot | undefined> {
    await this.ensureInitialized();
    return this.bots.get(id);
  }

  async getBotByAccessCode(accessCode: string): Promise<MonitoredBot | undefined> {
    await this.ensureInitialized();
    return Array.from(this.bots.values()).find(bot => bot.accessCode === accessCode);
  }

  async getBotByDiscordUserId(userId: string): Promise<MonitoredBot | undefined> {
    await this.ensureInitialized();
    return Array.from(this.bots.values()).find(bot => bot.discordUserId === userId);
  }

  async createBot(insertBot: InsertMonitoredBot): Promise<MonitoredBot> {
    await this.ensureInitialized();
    const id = randomUUID();
    const bot: MonitoredBot = {
      ...insertBot,
      id,
      createdAt: new Date().toISOString(),
    };
    this.bots.set(id, bot);
    await this.save();
    return bot;
  }

  async updateBot(id: string, updates: Partial<MonitoredBot>): Promise<MonitoredBot | undefined> {
    await this.ensureInitialized();
    const bot = this.bots.get(id);
    if (!bot) return undefined;
    
    const updated = { ...bot, ...updates };
    this.bots.set(id, updated);
    await this.save();
    return updated;
  }

  async deleteBot(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const deleted = this.bots.delete(id);
    if (deleted) {
      await this.save();
    }
    return deleted;
  }

  async addResetLog(log: Omit<ResetLog, "id">): Promise<ResetLog> {
    await this.ensureInitialized();
    const resetLog: ResetLog = {
      ...log,
      id: randomUUID(),
    };
    this.logs.push(resetLog);
    await this.saveLogs();
    return resetLog;
  }

  async getResetLogs(limit: number = 50): Promise<ResetLog[]> {
    await this.ensureInitialized();
    return this.logs.slice(-limit).reverse();
  }
}

export const storage = new MemStorage();
