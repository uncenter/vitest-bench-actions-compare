import { expect, test } from 'vitest'
import { readFileSync } from "node:fs";

import { load } from "js-yaml";
import { parse } from "yaml";

const lockfile = readFileSync("./resources/pnpm-lockfile.yaml", "utf-8");
const workflow = readFileSync("./resources/pnpm-workflow.yaml", "utf-8");

test('lockfile performance', async ({ bench }) => {
  const result = await bench.compare(
    bench('js-yaml',
      { writeResult: './results/js-yaml-lockfile.json' },
      () => { load(lockfile) }
    ),
    bench('yaml',
      { writeResult: './results/yaml-lockfile.json' },
      () => { parse(lockfile) }
    ),
    bench.from('previous js-yaml', './results/js-yaml-lockfile.json'),
    bench.from('previous yaml', './results/yaml-lockfile.json'),
  )
})

test('workflow performance', async ({ bench }) => {
  const result = await bench.compare(
    bench('js-yaml',
      { writeResult: './results/js-yaml-workflow.json' },
      () => { load(workflow) }
    ),
    bench('yaml',
      { writeResult: './results/yaml-workflow.json' },
      () => { parse(workflow) }
    ),
    bench.from('previous js-yaml', './results/js-yaml-workflow.json'),
    bench.from('previous yaml', './results/yaml-workflow.json'),
  )
})