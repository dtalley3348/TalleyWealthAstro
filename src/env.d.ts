/// <reference types="astro/client" />

interface Window {
  talleyTrackEvent?: (name: string, params?: Record<string, unknown>) => void;
}

declare namespace App {
  interface Locals {
    site: {
      id: string;
      tenantKey: string;
      name: string;
      siteUrl: string;
      headInject?: string;
      bodyStartInject?: string;
    };
  }
}
