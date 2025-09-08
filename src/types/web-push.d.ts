declare module 'web-push' {
  export type PushSubscription = {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };

  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;

  export type SendOptions = {
    TTL?: number;
    urgency?: 'very-low' | 'low' | 'normal' | 'high';
    topic?: string;
    proxy?: string;
    headers?: Record<string, string>;
  };

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer,
    options?: SendOptions,
  ): Promise<{ statusCode: number }>;

  const _default: {
    setVapidDetails: typeof setVapidDetails;
    sendNotification: typeof sendNotification;
  };
  export default _default;
}


