import axios from 'axios';
import { configManager } from './app.js';
import logger from './logger.js';

const api = axios.create();

export function updateBaseUrl(): void {
  const baseUrl = configManager.get('main_node_url');
  const apiUrl = (baseUrl || '').replace(/\/$/, '') + '/api';
  if (baseUrl) {
    api.defaults.baseURL = apiUrl;
    logger.info(`Base API URL set to ${apiUrl}`);
  }
}

export default api;
