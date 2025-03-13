import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import logger from './logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dataDir = path.join(__dirname, '../', 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir);

export class ConfigManager {
  private configPath: string;
  private configData: WorkerConfig = {
    main_node_url: null,
    channels: [],
  };

  constructor(filename = 'config.json') {
    this.configPath = path.join(dataDir, filename);
  }

  public async init(): Promise<void> {
    if (existsSync(this.configPath)) {
      try {
        const data = await fs.readFile(this.configPath, 'utf-8');
        this.configData = JSON.parse(data);
        logger.info('Configuration loaded');
      } catch (error) {
        logger.error('Error reading config file:', error);
      }
    } else {
      logger.warn('No configuration file found, creating a new one...');
      this.save();
    }
  }

  public get<T = any>(key: ConfigKeys): T | undefined {
    return this.configData[key];
  }

  public getAll(): WorkerConfig {
    return { ...this.configData };
  }

  public async set(key: ConfigKeys, value: any): Promise<void> {
    this.configData[key] = value;
    await this.save();
  }

  private async save(): Promise<void> {
    try {
      await fs.writeFile(this.configPath, JSON.stringify(this.configData, null, 2), 'utf-8');
    } catch (error) {
      logger.error('Error writing config file:', error);
    }
  }
}
