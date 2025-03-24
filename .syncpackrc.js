// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      label: 'Use workspace protocol',
      dependencies: ['$LOCAL'],
      dependencyTypes: ['dev', 'prod'],
      pinVersion: 'workspace:*',
    },
  ],
};

module.exports = config;
