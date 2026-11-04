import { profile, services } from '../src/data/profile.js';
import { experience } from '../src/data/experience.js';
import { projects, PROJECT_CATEGORIES } from '../src/data/projects.js';
import { skillGroups } from '../src/data/skills.js';
import { contact, socialLinks } from '../src/data/links.js';
import { credits } from '../src/data/credits.js';

const errors = [];
const todos = [];
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const STATUSES = ['completed', 'in-progress'];
const ids = new Set();

const fail = (where, message) => errors.push(`${where}: ${message}`);
const text = (where, value, field) => {
  if (typeof value !== 'string' || !value.trim()) fail(where, `"${field}" must be a non-empty string`);
};
const list = (where, value, field, { allowEmpty = false } = {}) => {
  if (!Array.isArray(value)) return fail(where, `"${field}" must be an array`);
  if (!allowEmpty && value.length === 0) fail(where, `"${field}" must not be empty`);
  value.forEach((item, i) => text(where, item, `${field}[${i}]`));
  if (new Set(value).size !== value.length) fail(where, `"${field}" has duplicates`);
};
const month = (where, value, field, { nullable = false } = {}) => {
  if (value === null && nullable) return;
  if (!MONTH.test(value ?? '')) fail(where, `"${field}" must be YYYY-MM${nullable ? ' or null' : ''}`);
};
const url = (where, value, field) => {
  if (!/^(https:\/\/|mailto:)/.test(value ?? '')) fail(where, `"${field}" must be an https:// or mailto: URL`);
};
const uniqueId = (where, id) => {
  text(where, id, 'id');
  if (ids.has(id)) fail(where, `duplicate id "${id}"`);
  ids.add(id);
};
const endKey = (end) => end ?? '9999-12';

text('profile', profile.name, 'name');
text('profile', profile.role, 'role');
text('profile', profile.tagline, 'tagline');
month('profile', profile.careerStart, 'careerStart');
list('profile', profile.roles, 'roles');
text('profile', profile.aboutHeading, 'aboutHeading');
list('profile', profile.about, 'about');

services.forEach((s) => {
  const where = `services/${s.id}`;
  uniqueId(where, s.id);
  ['title', 'description', 'details'].forEach((f) => text(where, s[f], f));
  list(where, s.tags, 'tags');
});

experience.forEach((company, ci) => {
  const where = `experience/${company.id}`;
  uniqueId(where, company.id);
  ['company', 'location'].forEach((f) => text(where, company[f], f));
  month(where, company.start, 'start');
  month(where, company.end, 'end', { nullable: true });
  const next = experience[ci + 1];
  if (next && next.start > company.start) fail(where, 'companies must be ordered newest first');

  company.projects.forEach((p, pi) => {
    const at = `${where}/${p.id}`;
    uniqueId(at, p.id);
    ['title', 'role', 'summary'].forEach((f) => text(at, p[f], f));
    month(at, p.start, 'start');
    month(at, p.end, 'end', { nullable: true });
    if (endKey(p.end) < p.start) fail(at, 'end is before start');
    if (p.start < company.start || endKey(p.end) > endKey(company.end)) fail(at, 'project dates fall outside the company dates');
    const following = company.projects[pi + 1];
    if (following && following.start > p.start) fail(at, 'projects must be ordered newest first');
    list(at, p.highlights, 'highlights', { allowEmpty: true });
    list(at, p.tech, 'tech', { allowEmpty: true });
    if (p.highlights.length === 0) todos.push(`${at}: no highlights yet`);
    if (p.tech.length === 0) todos.push(`${at}: no tech stack yet`);
  });
});

const experienceIds = new Set(experience.flatMap((c) => c.projects.map((p) => p.id)));
projects.forEach((p) => {
  const where = `projects/${p.id}`;
  if (ids.has(p.id) && !experienceIds.has(p.id)) fail(where, `duplicate id "${p.id}"`);
  ['title', 'summary'].forEach((f) => text(where, p[f], f));
  if (!(p.category in PROJECT_CATEGORIES)) fail(where, `unknown category "${p.category}"`);
  if (!STATUSES.includes(p.status)) fail(where, `status must be one of ${STATUSES.join(', ')}`);
  if (p.experienceId && !experienceIds.has(p.experienceId)) fail(where, `experienceId "${p.experienceId}" does not exist`);
  list(where, p.tech, 'tech', { allowEmpty: true });
  Object.entries(p.links ?? {}).forEach(([k, v]) => url(where, v, `links.${k}`));
  if (p.todo) todos.push(`${where}: placeholder, details to be added`);
});
if (new Set(projects.map((p) => p.id)).size !== projects.length) fail('projects', 'duplicate project ids');

skillGroups.forEach((g) => {
  const where = `skills/${g.id}`;
  uniqueId(where, g.id);
  text(where, g.title, 'title');
  list(where, g.skills, 'skills');
});

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) fail('links', '"email" is not a valid address');
if (contact.cv === null) todos.push('links: CV file not added yet');
else text('links', contact.cv, 'cv');
socialLinks.forEach((l) => {
  uniqueId(`links/${l.id}`, l.id);
  text(`links/${l.id}`, l.label, 'label');
  url(`links/${l.id}`, l.url, 'url');
});

credits.forEach((c, i) => {
  ['work', 'author', 'license'].forEach((f) => text(`credits/${i}`, c[f], f));
  url(`credits/${i}`, c.licenseUrl, 'licenseUrl');
});

if (todos.length) console.log(`Still to fill in (${todos.length}):\n  ${todos.join('\n  ')}\n`);
if (errors.length) {
  console.log(`Data check failed (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('All data checks passed.');
