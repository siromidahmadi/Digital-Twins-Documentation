document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = year;

  const projectForm = document.getElementById('projectForm');
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();

    if (!title || !description) {
      alert('⚠️ Please fill out both fields!');
      return;
    }

    const projectData = { title, description, createdAt: new Date().toISOString() };
    await saveProject(projectData);
    projectForm.reset();
  });

  // Load projects when the page opens
  loadProjects();
});

// Save project via Netlify Blobs function
async function saveProject(projectData) {
  try {
    const res = await fetch('/.netlify/functions/saveProject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });

    if (res.ok) {
      alert('✅ Project saved successfully!');
      loadProjects();
    } else {
      alert('❌ Failed to save project.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('🚫 Error saving project.');
  }
}

// Load projects from Netlify Blobs
async function loadProjects() {
  try {
    const res = await fetch('/.netlify/functions/saveProject');
    const projects = await res.json();

    const container = document.getElementById('saved-projects');
    container.innerHTML = '';

    if (!projects.length) {
      container.innerHTML = '<p>No projects yet. Create one above!</p>';
      return;
    }

    projects.reverse().forEach(p => {
      const div = document.createElement('div');
      div.className = 'project-item';
      div.innerHTML = `
        <h4>${p.title}</h4>
        <p>${p.description}</p>
        <small>📅 ${new Date(p.date || p.createdAt).toLocaleString()}</small>
        <hr>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading projects:', err);
    document.getElementById('saved-projects').innerHTML = '<p>Error loading projects.</p>';
  }
}
