import { UAParser } from 'ua-parser-js';

export type ParsedUA = {
  device: string;
  os: string;
  browser: string;
  /** False for scripts, monitors, and crawlers: no identifiable browser+OS,
   *  or a UA token that marks automated clients. Real browsers always parse. */
  looksHuman: boolean;
};

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|telegrambot|whatsapp|preview|curl|wget|python|go-http|node-fetch|axios|okhttp|java\/|libwww|httpclient|headless|lighthouse|pingdom|uptime|monitor|checkly|probe|scan/i;

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
    looksHuman: Boolean(browser.name && os.name),
  };
}
