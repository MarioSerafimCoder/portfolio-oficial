import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import {Header,Footer,MotionObserver} from '@/components/shell';
import {JournalPreferencesProvider,SiteSkipLink} from '@/components/journal-preferences';
import {site} from '@/content/site';
import '@/app/globals.css';
import '@/app/interactions.css';
import '@/app/evolution.css';
import '@/app/motion.css';
import '@/app/spatial.css';
import '@/app/reveals.css';
import '@/app/editorial.css';
import '@/app/perception.css';
import '@/app/scenography.css';
import '@/app/animated-logo.css';
import {ChapterReveals} from '@/components/chapter-reveals';
import {SpatialMotion} from '@/components/spatial-motion';
import {AnalyticsProvider} from '@/components/analytics-provider';
const serif=localFont({src:[{path:'../../public/fonts/instrument-serif-regular.woff2',weight:'400',style:'normal'},{path:'../../public/fonts/instrument-serif-italic.woff2',weight:'400',style:'italic'}],variable:'--font-serif',display:'swap'});
const sans=localFont({src:[{path:'../../public/fonts/aglet-sans-variable.otf',weight:'100 900',style:'normal'},{path:'../../public/fonts/aglet-sans-variable-italic.otf',weight:'100 900',style:'italic'}],variable:'--font-sans',display:'swap',preload:false});
export const fontClassName=`${serif.variable} ${sans.variable}`;
const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://marioserafim.com.br';
export const metadata:Metadata={
 metadataBase:new URL(configuredUrl||'http://localhost:3000'),
 title:{default:'Mário Serafim — Direção de arte & design',template:'%s — Mário Serafim'},description:site.description,
 applicationName:'Mário Serafim',authors:[{name:site.name,url:site.linkedin}],
 openGraph:{type:'website',locale:'pt_BR',title:'Mário Serafim — Direção de arte & design',description:site.description,siteName:site.name},
 twitter:{card:'summary_large_image',title:'Mário Serafim — Direção de arte & design',description:site.description},
 robots:{index:true,follow:true},
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: light)',color:'#F8F9FA'},{media:'(prefers-color-scheme: dark)',color:'#121212'}]};
// Run inline before the header is parsed, including on static exports without hydration yet.
const appearanceScript = `(() => {
    const root = document.documentElement;
    let theme;
    try { theme = localStorage.getItem('ms-theme'); } catch {}
    root.dataset.theme = theme === 'dark' || theme === 'light'
        ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const key = 'mario-serafim-logo-intro-v1';
    try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
    } catch {}
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) root.dataset.logoIntro = '';
})();`;
/** Shared body content only. Every root layout owns its document elements directly. */
export default function SiteLayout({children}:{children:React.ReactNode}){return <><script id="site-appearance" dangerouslySetInnerHTML={{__html:appearanceScript}}/><JournalPreferencesProvider><SiteSkipLink/><Header/>{children}<Footer/><MotionObserver/><SpatialMotion/><ChapterReveals/><AnalyticsProvider/></JournalPreferencesProvider></>}
