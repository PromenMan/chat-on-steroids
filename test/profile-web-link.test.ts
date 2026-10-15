import { afterEach, expect, it, vi } from 'vitest';
const mocked = vi.hoisted(() => ({ external: vi.fn(), embedded: vi.fn() }));
vi.mock('electron', () => ({ shell: { openExternal: mocked.external } }));
vi.mock('../src/main/browser.js', () => ({ openInPreferredBrowser: mocked.embedded }));
import { openProfileWebLink } from '../src/main/profile-web-link.js';
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });

it('keeps account, download and plugin authorization links inside Documents', async () => {
  vi.stubEnv('FELDMAN_DOCUMENTS_RUNTIME_DIR', 'documents-runtime');
  for (const url of ['https://github.com/example/releases', 'https://provider.example/authorize?state=fixture', 'http://127.0.0.1:43123/auth/callback']) {
    await openProfileWebLink(url);
    expect(mocked.embedded).toHaveBeenLastCalledWith(url, { reveal: true });
  }
  expect(mocked.external).not.toHaveBeenCalled();
});

it('refuses non-web protocol handlers in the Documents runtime', async () => {
  vi.stubEnv('FELDMAN_DOCUMENTS_RUNTIME_DIR', 'documents-runtime');
  await expect(openProfileWebLink('intent://external-browser')).rejects.toThrow('web page');
  expect(mocked.embedded).not.toHaveBeenCalled();
  expect(mocked.external).not.toHaveBeenCalled();
});

it('preserves the ordinary upstream system-browser handoff', async () => {
  vi.stubEnv('FELDMAN_DOCUMENTS_RUNTIME_DIR', '');
  await openProfileWebLink('https://provider.example/authorize');
  expect(mocked.external).toHaveBeenCalledWith('https://provider.example/authorize');
  expect(mocked.embedded).not.toHaveBeenCalled();
});
