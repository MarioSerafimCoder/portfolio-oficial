'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics';
export function TrackedLink({ href, event, className, children }: {
    href: string;
    event: AnalyticsEvent;
    className?: string;
    children: ReactNode;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    return <Link href={i18nHref(href)} className={className} onClick={() => trackEvent(event)}>{i18nText(children)}</Link>;
}
