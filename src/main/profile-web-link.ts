import { documentsRuntimeDirectory } from './documents-profile.js';

/** Web links from settings and plugin authorization follow the owning app's browser policy. */
export async function openProfileWebLink(url: string): Promise<void> {
  if (documentsRuntimeDirectory()) {
    if (!/^https?:\/\//i.test(url)) throw new Error('Open a web page in the Documents browser');
    const { openInPreferredBrowser } = await import('./browser.js');
    await openInPreferredBrowser(url, { reveal: true });
    return;
  }
  const { shell } = await import('electron');
  await shell.openExternal(url);
}
