import { Viewer, type ViewerDoc } from './viewer_model.js';

async function add(id: string): Promise<ViewerDoc> {
  const viewer = new Viewer({ id });
  await viewer.save();
  return viewer;
}

async function get(id: string): Promise<ViewerDoc | null> {
  return Viewer.findOne({ id });
}

export default {
  add,
  get,
};
