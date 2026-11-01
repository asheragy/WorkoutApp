// Metro's require.context (enabled via transformer.unstable_allowRequireContext).
// https://metrobundler.dev/docs/module-api/#requirecontext

interface MetroRequireContext {
  keys(): string[];
  (key: string): unknown;
  resolve(key: string): string;
  id: string;
}

interface NodeRequire {
  context(
    directory: string,
    recursive?: boolean,
    filter?: RegExp,
    mode?: 'sync' | 'eager' | 'lazy' | 'lazy-once',
  ): MetroRequireContext;
}
