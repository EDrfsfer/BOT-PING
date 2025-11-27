import { z } from "zod";

// Schema para bots monitorados
export const monitoredBotSchema = z.object({
  id: z.string(),
  name: z.string(),
  monitorUrl: z.string().url(),
  uptimeRobotMonitorId: z.string(),
  notificationChannelId: z.string().optional(),
  createdAt: z.string(),
  lastChecked: z.string().optional(),
  lastReset: z.string().optional(),
});

export const insertMonitoredBotSchema = monitoredBotSchema.omit({
  id: true,
  createdAt: true,
  lastChecked: true,
  lastReset: true,
}).extend({
  accessCode: z.string().optional(),
});

// Schema para logs de reset
export const resetLogSchema = z.object({
  id: z.string(),
  botId: z.string(),
  botName: z.string(),
  monitorId: z.string(),
  timestamp: z.string(),
  reason: z.string(),
  success: z.boolean(),
});

export type MonitoredBot = z.infer<typeof monitoredBotSchema>;
export type InsertMonitoredBot = z.infer<typeof insertMonitoredBotSchema>;
export type ResetLog = z.infer<typeof resetLogSchema>;