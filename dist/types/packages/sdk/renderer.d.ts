export declare class Renderer {
    /**
     * Sanitizes raw HTML markup against script tags, inline event handlers,
     * and dangerous javascript: URLs before inserting into the DOM.
     */
    sanitizeHTML(html: string): string;
    /**
     * Mounts the HTML string safely into a DOM element.
     * @param containerId The ID of the container element.
     * @param html The HTML string to render.
     */
    mount(containerId: string, html: string): void;
}
