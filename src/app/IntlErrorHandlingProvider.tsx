'use client';

import {NextIntlClientProvider, IntlErrorCode, useLocale, useMessages} from 'next-intl';

export default function IntlErrorHandlingProvider({children}: {children: React.ReactNode}) {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
          if (process.env.NODE_ENV !== 'production') console.error(error);
        } else {
          console.error(error);
        }
      }}
      getMessageFallback={({namespace, key, error}) => {
        const path = [namespace, key].filter(Boolean).join('.');
        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
          return `${path} is not yet translated`;
        }
        return `Please fix message: ${path}`;
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}


