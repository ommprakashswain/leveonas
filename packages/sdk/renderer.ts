import { isAttributeSafe } from '../security/attributes';
import { isDangerousProtocol } from '../security/urls';

export class Renderer {
  /**
   * Sanitizes raw HTML markup against script tags, inline event handlers,
   * and dangerous javascript: URLs before inserting into the DOM.
   */
  public sanitizeHTML(html: string): string {
    if (typeof html !== 'string') return '';

    let clean = html;
    // 1. Remove script tags and contents
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // 2. Remove object, embed, iframe, and applet tags
    clean = clean.replace(/<\/?(?:object|embed|applet|meta)\b[^>]*>/gi, '');
    // 3. Remove inline event handlers (on*)
    clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    // 4. Remove javascript: and vbscript: protocols in href/src
    clean = clean.replace(/(href|src|action|poster)\s*=\s*(["'])(.*?)\2/gi, (match, attr, quote, url) => {
      if (isDangerousProtocol(url)) {
        return `${attr}=${quote}#${quote}`;
      }
      return match;
    });

    return clean;
  }

  /**
   * Mounts the HTML string safely into a DOM element.
   * @param containerId The ID of the container element.
   * @param html The HTML string to render.
   */
  mount(containerId: string, html: string) {
    if (typeof window !== 'undefined') {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = this.sanitizeHTML(html);
      }
    }
  }
}
