export function getDomainFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, '') || url;
  } catch {
    return url;
  }
}

export function faviconUrlForDomain(domain: string): string {
  const encoded = encodeURIComponent(domain);
  return `https://www.google.com/s2/favicons?domain=${encoded}&sz=64`;
}
