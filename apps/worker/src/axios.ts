import axios from 'axios';
import { configManager } from './app.js';

const api = axios.create();

export function updateBaseUrl() {
  const baseUrl = configManager.get('api_url');
  const apiUrl = (baseUrl || '').replace(/\/$/, '') + '/api';
  if (baseUrl) api.defaults.baseURL = apiUrl;
}

export default api;
