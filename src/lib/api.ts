const isLocalHostname = (hostname: string) => {
  if (!hostname) {
    return true;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true;
  }

  return hostname.endsWith('.local');
};

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (!isLocalHostname(hostname)) {
      const portSegment = port ? `:${port}` : '';
      return `${protocol}//${hostname}${portSegment}`;
    }
  }

  return 'http://localhost:4000';
};

export const buildApiUrl = (path: string) => {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
