import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import logger from './logger.js';

export const dataDir = path.join(process.cwd(), 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir);

type Keys = 'api_url';

export class ConfigManager {
  private configPath: string;
  private configData: Record<string, any> = {};

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
        this.configData = {};
      }
    } else {
      logger.warn('No configuration file found, creating a new one...');
      this.set('api_url', null);
    }
  }

  public get<T = any>(key: Keys): T | undefined {
    return this.configData[key];
  }

  public async set(key: string, value: any): Promise<void> {
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
