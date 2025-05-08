import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_FILE__DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToLocal = async (file) => {
  const newPath = path.join(UPLOAD_FILE__DIR, file.filename);
  await fs.rename(file.path, newPath);
  return `${getEnvVar('BACKEND_DOMAIN')}/upload/${file.filename}`;
};
