module.exports = {
  '{apps,libs,tools}/**/*.{js,ts,svelte,json}': [
    (files) => `nx affected:lint --files=${files.join(',')}`,
    (files) => `nx format:write --files=${files.join(',')}`,
  ],
};
