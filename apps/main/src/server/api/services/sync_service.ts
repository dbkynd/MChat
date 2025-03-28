import axios from 'axios';
import WorkerService from '../../../database/lib/worker/worker_service.js';

async function updateWorkers() {
  const workers = await WorkerService.list();
  const uris = workers.map((worker) => `${worker.uri.replace(/$\//, '')}/api/sync`);
  await Promise.all(uris.map((uri) => axios.post(uri).catch(() => {})));
}

export default { updateWorkers };
