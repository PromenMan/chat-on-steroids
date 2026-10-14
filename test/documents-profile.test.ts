import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Config } from '../src/shared/types.js';
import { documentsProfile, watchDocumentsParent } from '../src/main/documents-profile.js';

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.useRealTimers(); });
const config = { capabilities: { read: true, command: true, control: true },
  multiAgent: { enabled: true }, ui: { chatBrowser: 'chrome', startAtLogin: true },
  controlApi: { enabled: false, allowActions: false } } as unknown as Config;

describe('Documents runtime ownership', () => {
  it('forces its embedded browser and excludes coding/desktop powers without mutating ordinary CoS', () => {
    vi.stubEnv('FELDMAN_DOCUMENTS_RUNTIME_DIR', '');
    expect(documentsProfile(config)).toBe(config);
    vi.stubEnv('FELDMAN_DOCUMENTS_RUNTIME_DIR', 'C:/Documents/assistant/cos-runtime');
    const profile = documentsProfile(config);
    expect(profile.ui.chatBrowser).toBe('cos');
    expect(Object.values(profile.capabilities).some(Boolean)).toBe(false);
    expect(profile.multiAgent.enabled).toBe(false);
    expect(profile.controlApi).toEqual({ enabled: true, allowActions: true });
    expect(config.ui.chatBrowser).toBe('chrome');
  });
  it('quits only when its owning helper is gone, and releases the watcher', () => {
    vi.useFakeTimers();
    vi.stubEnv('FELDMAN_DOCUMENTS_RUNTIME_DIR', 'C:/Documents/assistant/cos-runtime');
    vi.stubEnv('FELDMAN_DOCUMENTS_PARENT_PID', '9999');
    const probe = vi.spyOn(process, 'kill').mockReturnValue(true);
    const quit = vi.fn();
    const dispose = watchDocumentsParent(quit);
    vi.advanceTimersByTime(2000);
    expect(probe).toHaveBeenCalledWith(9999, 0);
    expect(quit).not.toHaveBeenCalled();
    probe.mockImplementation(() => { throw Object.assign(new Error('gone'), { code: 'ESRCH' }); });
    vi.advanceTimersByTime(2000);
    expect(quit).toHaveBeenCalledOnce();
    dispose();
    expect(vi.getTimerCount()).toBe(0);
  });
});
