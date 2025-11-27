import axios from "axios";

const UPTIMEROBOT_API_URL = "https://api.uptimerobot.com/v2";

export interface UptimeRobotMonitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number;
  create_datetime: number;
}

export interface UptimeRobotResponse {
  stat: string;
  monitors?: UptimeRobotMonitor[];
  monitor?: {
    id: number;
  };
  error?: {
    type: string;
    message: string;
  };
}

export interface MonitorHealth {
  needsReset: boolean;
  reason: string;
  status: number;
}

export class UptimeRobotService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getMonitors(monitorIds?: string[], retries = 3): Promise<UptimeRobotMonitor[]> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post<UptimeRobotResponse>(
          `${UPTIMEROBOT_API_URL}/getMonitors`,
          {
            api_key: this.apiKey,
            format: "json",
            ...(monitorIds && { monitors: monitorIds.join("-") }),
          },
          { timeout: 10000 }
        );

        if (response.data.stat === "fail") {
          throw new Error(response.data.error?.message || "Failed to get monitors");
        }

        return response.data.monitors || [];
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < retries) {
          console.log(`Tentativa ${attempt} falhou, tentando novamente em ${1000 * attempt}ms...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    console.error(`Error fetching monitors from UptimeRobot after ${retries} attempts:`, lastError);
    throw new Error("Não foi possível conectar ao UptimeRobot. Verifique sua API Key e conexão.");
  }

  async getMonitor(monitorId: string): Promise<UptimeRobotMonitor | null> {
    const monitors = await this.getMonitors([monitorId]);
    return monitors.length > 0 ? monitors[0] : null;
  }

  async checkMonitorHealth(monitorId: string): Promise<MonitorHealth> {
    try {
      const monitors = await this.getMonitors([monitorId]);
      
      if (!monitors || monitors.length === 0) {
        return {
          needsReset: false,
          reason: "Monitor não encontrado",
          status: -1,
        };
      }

      const monitor = monitors[0];
      const status = monitor.status;

      // Status codes UptimeRobot:
      // 0 = paused
      // 1 = not checked yet
      // 2 = up
      // 8 = seems down
      // 9 = down

      const needsReset = status === 8 || status === 9;
      let reason = "";

      if (status === 8) {
        reason = "Monitor aparenta estar com problemas (seems down)";
      } else if (status === 9) {
        reason = "Monitor está offline (down)";
      } else if (status === 2) {
        reason = "Monitor está funcionando normalmente (up)";
      }

      console.log(`📊 Status do monitor ${monitorId}: ${status} - ${reason}`);

      return {
        needsReset,
        reason,
        status,
      };
    } catch (error) {
      console.error(`❌ Erro ao verificar saúde do monitor ${monitorId}:`, error);
      throw error;
    }
  }

  async resetMonitor(monitorId: string): Promise<boolean> {
    try {
      // Usar o endpoint de reset do UptimeRobot
      const response = await fetch(`${UPTIMEROBOT_API_URL}/resetMonitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          api_key: this.apiKey,
          id: monitorId,
        }).toString(),
      });

      const data: UptimeRobotResponse = await response.json();

      if (data.stat === "ok") {
        console.log(`✅ Monitor ${monitorId} resetado com sucesso`);
        return true;
      } else {
        console.error(`❌ Erro ao resetar monitor: ${data.error?.message}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erro ao resetar monitor ${monitorId}:`, error);
      return false;
    }
  }
}

export const uptimeRobotService = new UptimeRobotService(
  process.env.UPTIMEROBOT_API_KEY || ""
);
