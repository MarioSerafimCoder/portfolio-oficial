'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSiteTranslation } from '@/i18n/use-translation';

function finishLogoIntro() {
    delete document.documentElement.dataset.logoIntro;
}

export function AnimatedLogo() {
    const { i18nHref, i18nText } = useSiteTranslation();
    const pathname = usePathname();
    const initialPath = useRef(pathname);

    useLayoutEffect(() => {
        if (pathname !== initialPath.current) finishLogoIntro();
    }, [pathname]);

    useEffect(() => {
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        const respectPreference = () => {
            if (preference.matches) finishLogoIntro();
        };
        respectPreference();
        preference.addEventListener('change', respectPreference);
        window.addEventListener('pagehide', finishLogoIntro);
        return () => {
            preference.removeEventListener('change', respectPreference);
            window.removeEventListener('pagehide', finishLogoIntro);
        };
    }, []);

    return (
        <div className="header-brand">
            <Link className="animated-logo" href={i18nHref('/')} aria-label={i18nText('Mário Serafim — início')}>
                <Image className="animated-logo-symbol" src="/brand/logo-icon.png" alt="" width={274} height={136} unoptimized loading="eager" />
                <span className="animated-logo-mask" aria-hidden="true" onAnimationEnd={finishLogoIntro}>
                    <Image className="animated-logo-name" src="/brand/logo-wordmark.png" alt="" width={810} height={136} unoptimized loading="eager" />
                </span>
            </Link>
        </div>
    );
}
