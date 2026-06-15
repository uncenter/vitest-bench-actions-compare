import { readFileSync } from "node:fs";
import { load as _load } from "js-yaml";
import { parse } from "yaml";

import { describe, test } from 'vitest';
import { createBenchCache } from './lib.js';

function load(input) {
  return [_load(input), _load(input + "\n")];
}

const lockfile = readFileSync("./resources/pnpm-lockfile.yaml", "utf-8");
const workflow = readFileSync("./resources/pnpm-workflow.yaml", "utf-8");

const cache = createBenchCache();

describe('lockfile resource', () => {
  const jsYaml = cache.ref('js-yaml-lockfile', 'js-yaml');
  const yaml = cache.ref('yaml-lockfile', 'yaml');

  jsYaml.exists && test('js-yaml vs previous', async ({ bench }) => {
    await bench.compare(
      bench('current', {}, () => load(lockfile)),
      jsYaml.load(bench, { name: 'previous' }),
    );
  });

  yaml.exists && test('yaml vs previous', async ({ bench }) => {
    await bench.compare(
      bench('current', {}, () => parse(lockfile)),
      yaml.load(bench, { name: 'previous' }),
    );
  });

  jsYaml.exists && yaml.exists && test('previous head to head', async ({ bench }) => {
    await bench.compare(jsYaml.load(bench), yaml.load(bench));
  });

  test('head to head', async ({ bench }) => {
    await bench.compare(
      jsYaml.save(bench, () => load(lockfile)),
      yaml.save(bench, () => parse(lockfile)),
    );
  });
});

describe('workflow resource', () => {
  const jsYaml = cache.ref('js-yaml-workflow', 'js-yaml');
  const yaml = cache.ref('yaml-workflow', 'yaml');

  jsYaml.exists && test('js-yaml vs previous', async ({ bench }) => {
    await bench.compare(
      bench('current', {}, () => load(workflow)),
      jsYaml.load(bench, { name: 'previous' }),
    );
  });

  yaml.exists && test('yaml vs previous', async ({ bench }) => {
    await bench.compare(
      bench('current', {}, () => parse(workflow)),
      yaml.load(bench, { name: 'previous' }),
    );
  });

  jsYaml.exists && yaml.exists && test('previous head to head', async ({ bench }) => {
    await bench.compare(jsYaml.load(bench), yaml.load(bench));
  });

  test('head to head', async ({ bench }) => {
    await bench.compare(
      jsYaml.save(bench, () => load(workflow)),
      yaml.save(bench, () => parse(workflow)),
    );
  });
});
