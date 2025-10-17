import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock node:fs/promises and vite before importing the loader
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));
vi.mock('vite', () => ({
  transformWithEsbuild: vi.fn(),
}));

// Import the module under test AFTER mocking
import * as loader from './vite-node.plugin.loader.mjs';

describe('vite-node.plugin.loader.mjs', () => {
  let mockNextResolve, mockNextLoad;

  beforeEach(async () => {
    vi.resetAllMocks();
    // Mock node:fs/promises.readFile
    const { readFile } = await import('node:fs/promises');
    readFile.mockResolvedValue('export const x = 1;');
    // Mock node:path.extname
    vi.stubGlobal('extname', vi.fn((url) => url.slice(url.lastIndexOf('.'))));
    // Mock node:url.fileURLToPath
    vi.stubGlobal('fileURLToPath', vi.fn((url) => url.replace('file://', '')));
    // Mock vite.transformWithEsbuild
    const { transformWithEsbuild } = await import('vite');
    transformWithEsbuild.mockResolvedValue({ code: 'export const x=1;', map: 'inline' });
  });

  describe('resolve', () => {
    let mockNextResolve;

    beforeEach(() => {
      mockNextResolve = vi.fn(async (specifier, context) => ({ resolved: true, specifier, context }));
    });

    it('calls nextResolve with correct arguments and returns its result', async () => {
      const specifier = './foo.ts';
      const context = { parentURL: 'file:///bar' };
      const result = await loader.resolve(specifier, context, mockNextResolve);
      expect(mockNextResolve).toHaveBeenCalledWith(specifier, context, mockNextResolve);
      expect(result).toEqual({ resolved: true, specifier, context });
    });
  });

  describe('load', () => {
    let mockNextLoad;
    const mtsExtensions = ['.ts', '.tsx', '.mts', '.cts'];
    const fakeSource = 'export const x = 1;';
    const fakeTransformed = { code: 'export const x=1;', map: 'inline' };

    beforeEach(async () => {
      mockNextLoad = vi.fn(async (url, context) => ({ format: 'module', url, context }));
      // Mock node:fs/promises.readFile
      const { readFile } = await import('node:fs/promises');
      readFile.mockResolvedValue('export const x = 1;');
      // Mock node:path.extname
      vi.stubGlobal('extname', vi.fn((url) => url.slice(url.lastIndexOf('.'))));
      // Mock node:url.fileURLToPath
      vi.stubGlobal('fileURLToPath', vi.fn((url) => url.replace('file://', '')));
      // Mock vite.transformWithEsbuild
      vi.stubGlobal('transformWithEsbuild', vi.fn(async () => fakeTransformed));
    });

    mtsExtensions.forEach(ext => {
      it(`transforms ${ext} files and returns correct object`, async () => {
        const { readFile } = await import('node:fs/promises');
        const { transformWithEsbuild } = await import('vite');
        const url = `file:///test${ext}`;
        const context = {};
        const result = await loader.load(url, context, mockNextLoad);
        expect(readFile).toHaveBeenCalledWith('/test'+ext, 'utf8');
        expect(transformWithEsbuild).toHaveBeenCalledWith(
          fakeSource,
          '/test'+ext,
          {
            format: 'esm',
            loader: ext === '.tsx' ? 'tsx' : 'ts',
            sourcemap: 'inline',
          }
        );
        expect(result).toEqual({
          format: 'module',
          shortCircuit: true,
          source: fakeTransformed.code,
        });
      });
    });

    it('calls nextLoad for non-mts extensions', async () => {
      const url = 'file:///foo.js';
      const context = {};
      const result = await loader.load(url, context, mockNextLoad);
      expect(mockNextLoad).toHaveBeenCalledWith(url, context, mockNextLoad);
      expect(result).toEqual({ format: 'module', url, context });
    });

    it('handles readFile error', async () => {
      const { readFile } = await import('node:fs/promises');
      readFile.mockRejectedValueOnce(new Error('fail'));
      const url = 'file:///fail.ts';
      await expect(loader.load(url, {}, mockNextLoad)).rejects.toThrow('fail');
    });

    it('handles transformWithEsbuild error', async () => {
      const { readFile } = await import('node:fs/promises');
      const { transformWithEsbuild } = await import('vite');
      readFile.mockResolvedValueOnce('source'); // ensure readFile succeeds
      transformWithEsbuild.mockRejectedValueOnce(new Error('esbuild fail'));
      const url = 'file:///fail.ts';
      await expect(loader.load(url, {}, mockNextLoad)).rejects.toThrow('esbuild fail');
    });
  });
});