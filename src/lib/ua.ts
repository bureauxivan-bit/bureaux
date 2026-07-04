import { UAParser } from 'ua-parser-js';

export type ParsedUA = {
  device: string;
  os: string;
  browser: string;
};

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|telegrambot|whatsapp|preview/i;

export function isBotUserAgent(uaString: string): boolean {
  return BOT_RE.test(uaString);
}

export function parseUserAgent(uaString: string): ParsedUA {
  const parser = new UAParser(uaString);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  const deviceLabel = device.type
    ? [device.vendor, device.model].filter(Boolean).join(' ') || device.type
    : 'Desktop';

  return {
    device: deviceLabel,
    os: [os.name, os.version].filter(Boolean).join(' ') || 'Невідомо',
    browser: [browser.name, browser.version].filter(Boolean).join(' ') || 'Невідомо',
  };
}
