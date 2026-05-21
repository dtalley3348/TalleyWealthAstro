/// <reference types="astro/client" />

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
