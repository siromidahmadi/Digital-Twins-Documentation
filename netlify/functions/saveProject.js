import { getStore } from '@netlify/blobs';

export async function handler(event) {
  const store = getStore('projects-data');

  // Save new project
  if (event.httpMethod === 'POST') {
    try {
      const newProject = JSON.parse(event.body || '{}');
      const current = (await store.get('projects')) || '[]';
      const projects = JSON.parse(current);

      projects.push({
        title: newProject.title,
        description: newProject.description,
        date: new Date().toISOString(),
      });

      await store.set('projects', JSON.stringify(projects, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Project saved successfully', project: newProject }),
      };
    } catch (error) {
      console.error('Save error:', error);
      return { statusCode: 500, body: 'Failed to save project' };
    }
  }

  // Read all projects
  if (event.httpMethod === 'GET') {
    try {
      const data = (await store.get('projects')) || '[]';
      return { statusCode: 200, body: data };
    } catch (error) {
      console.error('Read error:', error);
      return { statusCode: 500, body: 'Failed to read projects' };
    }
  }

  return { statusCode: 405, body: 'Method not allowed' };
}
