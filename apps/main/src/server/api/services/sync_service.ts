import WorkerService from '../../../database/lib/worker/worker_service.js';
import axios from 'axios';

async function pushChannels() {
  const workers = await WorkerService.list();
  const urls = workers.map((url) => `${url.replace(/$\//, '')}/api/sync`);
  await Promise.all(urls.map((url) => axios.post(url).catch(() => {})));
}

export default { pushChannels };
