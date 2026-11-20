# Security Policy

This repository hosts a static personal website served by GitHub Pages.

## Reporting a vulnerability

Please report security issues privately through
[GitHub's private vulnerability reporting](https://github.com/aadabi/aadabi.github.io/security/advisories/new)
rather than opening a public issue. I aim to respond within 7 days.

## Hardening in place

- No server-side code and no bundled third-party JavaScript libraries
- Content-Security-Policy restricting scripts to same-origin
- Subresource Integrity on CDN-hosted stylesheets
- HTTPS-only links
