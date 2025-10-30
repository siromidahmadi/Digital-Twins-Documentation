# Luxury Docs — Multi-Project Guide

This static site lets multiple people add their own project docs without code changes.

## Where to add/edit projects
- File: `assets/data/projects.json`
- Section: the `projects` array
- Add one object per project using the schema below.

## Project object schema
```json
{
  "id": "string (unique, slug-like)",
  "name": "string",
  "owner": "string",
  "goal": "string",
  "features": ["string"],
  "fileStructure": "string (preformatted code block text)",
  "modularArchitecture": [
    { "title": "string", "function": "string", "dataTypes": ["string"], "problemSolved": "string" }
  ],
  "moduleFunctions": ["string"],
  "problem": "string",
  "dataTypes": ["string"]
}
```

## Example entry
```json
{
  "id": "alpha-earth",
  "name": "Digital Twins Project",
  "owner": "Team Core",
  "goal": "Build a premium, vector-enabled Earth visualization assistant with real-time datasets and AI-guided navigation.",
  "features": [
    "Real-time data integration",
    "Vector navigation & 3D routes",
    "AI assistant & contextual guidance"
  ],
  "fileStructure": "/project-root\n├─ /client\n├─ /server\n├─ /data\n└─ README.md",
  "modularArchitecture": [
    {"title":"Ingest","function":"Pull feeds and normalize to GeoJSON","dataTypes":["GeoJSON","CSV"],"problemSolved":"Unifies formats"}
  ],
  "moduleFunctions": ["Ingest","API","UI/Vis","Assistant"],
  "problem": "Geospatial data is scattered and hard to navigate.",
  "dataTypes": ["GeoJSON","CSV","Raster tiles","Time series","Binary"]
}
```

## How the site renders
- `projects.html` lists all projects (name, goal, owner). Click to open details.
- `project.html?id=your-id` shows all sections:
  - Goal of the Project
  - Key Features
  - File Structure
  - Modular Architecture
  - Function of Each Module
  - Problem it Solves
  - Data Type it Works With

## Tips for contributors (20+ people)
- Keep `id` unique (lowercase, dashes only), e.g., `ocean-watch`.
- Use `\n` for line breaks in `fileStructure`.
- Keep features and dataTypes concise lists.
- Validate JSON before committing (no trailing commas).

## Local preview
- Double-click `index.html`, or serve locally to avoid fetch restrictions:
  - Python: `python -m http.server` (then open http://localhost:8000/luxury-docs/)
  - Or use any static server / VS Code Live Server.

## Replace user photo
- Put your image at `assets/images/user-photo.jpg` (same filename).
