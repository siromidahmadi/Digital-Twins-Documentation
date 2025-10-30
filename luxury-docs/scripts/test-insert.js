import 'dotenv/config';
import { saveProject } from '../saveProject.js';

(async () => {
  try {
    const id = await saveProject({
      name: 'connectivity-test',
      source: 'manual',
      ts: new Date().toISOString()
    });
    console.log('Inserted ID:', id.toString());
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
