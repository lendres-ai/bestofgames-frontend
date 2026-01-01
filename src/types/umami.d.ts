/**
 * Umami Analytics type declarations
 * @see https://umami.is/docs/tracker-functions
 */
interface UmamiTracker {
    track(eventName: string, eventData?: Record<string, string | number | boolean>): void;
}

interface Window {
    umami?: UmamiTracker;
}
