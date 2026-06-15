import { existsSync } from 'node:fs';

/**
 * Creates a cache handle for saving and loading benchmark results.
 *
 * @param {{ dir?: string }} [options]
 */
export function createBenchCache({ dir = './results' } = {}) {
  function getResultsPath(name) {
    return `${dir}/${name}.json`;
  }

  return {
    /**
     * Bind to a result file. Use to check if the result exists, load the cached result, or save a new result.
     *
     * @param {string} id Cache identifier.
     * @param {string} [name] Optional name to use in benchmarks instead of the identifier.
     */
    ref(id, name) {
      const path = getResultsPath(id);

      return {
        exists: existsSync(path),

        /**
         * Run a benchmark and persist its result to the cache.
         * @param {import('vitest').Bench} bench
         * @param {() => unknown} fn
         * @param {{ name?: string }} [opts]
         */
        save(bench, fn, opts) {
          return bench(opts?.name ?? name ?? id, { writeResult: path }, fn);
        },
        /**
         * Load a previously cached result as a bench entry.
         * @param {import('vitest').Bench} bench
         * @param {{ name?: string }} [opts]
         */
        load(bench, opts) {
          return bench.from(opts?.name ?? name ?? id, path);
        },
      };
    },
  };
}
