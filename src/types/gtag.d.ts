/**
 * Google Tag (gtag.js) type declarations
 * @see https://developers.google.com/tag-platform/gtagjs/reference
 */
interface GtagEventParams {
    send_to?: string;
    value?: number;
    currency?: string;
    event_callback?: () => void;
    [key: string]: unknown;
}

interface Window {
    gtag?: (
        command: 'event' | 'config' | 'set' | 'js',
        targetId: string | Date,
        params?: GtagEventParams
    ) => void;
}
