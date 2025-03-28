import axios from 'axios';
import WorkerService from '../../../database/lib/worker/worker_service.js';

async function updateWorkers() {
  const workers = await WorkerService.list();
  const urls = workers.map((url) => `${url.replace(/$\//, '')}/api/sync`);
  await Promise.all(urls.map((url) => axios.post(url).catch(() => {})));
}

export default { updateWorkers };
