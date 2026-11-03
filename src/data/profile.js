import { yearsSince } from '../utils/dates.js';

const CAREER_START = '2018-06';
const YEARS = yearsSince(CAREER_START);

export const profile = {
  name: 'Bharath S',
  role: 'Full-Stack Developer',
  careerStart: CAREER_START,
  yearsOfExperience: YEARS,
  location: 'India',
  tagline: 'I build software across web, cloud, data and Android.',
  roles: ['Full-Stack Developer', 'Android Developer', 'Backend & Cloud Engineer'],
  about: [
    `I’m a full-stack developer who has spent the last ${YEARS}+ years shipping software for insurance, finance, sustainability, e-commerce and mobile products.`,
    'I’ve built REST and SOAP backends, enterprise systems and real-time prototypes, processed petabyte-scale data, and led small teams. Today I work on core features of an Android keyboard used by a large audience.',
    'Outside work, I build Minecraft plugins and tools for the modding community under Ninja6-MC.',
  ],
};

export const services = [
  {
    id: 'backend-cloud',
    title: 'Backend & Cloud',
    description: 'APIs, enterprise systems and cloud services that stay fast and reliable as they grow.',
    details: 'REST and SOAP APIs, system design, serverless pipelines and containerised deployments on Azure and AWS.',
    tags: ['Java', 'Kotlin', 'Node.js', 'Quarkus', 'Azure', 'Docker'],
  },
  {
    id: 'mobile-frontend',
    title: 'Mobile & Frontend',
    description: 'Interfaces people use every day, from Android features to web apps.',
    details: 'End-to-end Android features, React frontends and the APIs behind them.',
    tags: ['Android', 'Kotlin', 'React', 'JavaScript', 'HTML & CSS'],
  },
  {
    id: 'data-automation',
    title: 'Data & Automation',
    description: 'Turning large datasets and repetitive work into pipelines and reports.',
    details: 'Petabyte-scale processing, optimised data scripts, reporting dashboards and test automation.',
    tags: ['Azure Data Lake', 'Scope (U-SQL)', 'Azure Data Factory', 'Power BI', 'Selenium', 'Python'],
  },
];
