import { projects } from '../data/projects.js';

// Placeholders still waiting for details show while developing but never on the live site.
export const visibleProjects = projects.filter((project) => !project.todo || import.meta.env.DEV);

export const featuredProjects = visibleProjects.filter((project) => project.featured);

export const PROJECTS_PAGE_URL = `${import.meta.env.BASE_URL}projects/`;
