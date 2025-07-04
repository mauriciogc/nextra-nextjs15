// src/app/_meta.global.tsx

const GETTING_STARTED = {
  prerequisites: '',
  install: '',
};

const CONCEPTS = {
  routing: '',
  'mdx-features': '',
};

const META = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  docs: {
    type: 'page',
    title: 'Documentation',
    items: {
      'project-structure': '',
      'deployment-guide': '',
      'getting-started': { items: GETTING_STARTED },
      concepts: { items: CONCEPTS },
    },
  },
};

export default META;
