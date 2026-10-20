import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import {Header,Footer,MotionObserver} from '@/components/shell';
import {JournalPreferencesProvider,SiteSkipLink} from '@/components/journal-preferences';
import {site} from '@/content/site';
import './globals.css';
import './interactions.css';
import './evolution.css';
import {AnalyticsProvider} from '@/components/analytics-provider';
const serif=localFont({src:[{path:'../../public/fonts/instrument-serif-regular.woff2',weight:'400',style:'normal'},{path:'../../public/fonts/instrument-serif-italic.woff2',weight:'400',style:'italic'}],variable:'--font-serif',display:'swap'});
const sans=localFont({src:[{path:'../../public/fonts/dm-sans-regular.woff2',weight:'400',style:'normal'},{path:'../../public/fonts/dm-sans-medium.woff2',weight:'500',style:'normal'},{path:'../../public/fonts/dm-sans-semibold.woff2',weight:'600',style:'normal'}],variable:'--font-sans',display:'swap'});
const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://mario-serafim-portfolio-2026.mario-92.chatgpt.site';
export const metadata:Metadata={
 metadataBase:new URL(configuredUrl||'http://localhost:3000'),
 title:{default:'Mário Serafim — Direção de arte & design',template:'%s — Mário Serafim'},description:site.description,
 applicationName:'Mário Serafim',authors:[{name:site.name,url:site.linkedin}],
 openGraph:{type:'website',locale:'pt_BR',title:'Mário Serafim — Direção de arte & design',description:site.description,siteName:site.name},
 twitter:{card:'summary_large_image',title:'Mário Serafim — Direção de arte & design',description:site.description},
 robots:{index:true,follow:true},
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: light)',color:'#F8F9FA'},{media:'(prefers-color-scheme: dark)',color:'#121212'}]};
const themeScript=`(()=>{try{const v=localStorage.getItem('ms-theme');document.documentElement.dataset.theme=v==='dark'||v==='light'?v:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}catch{document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}})();`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><JournalPreferencesProvider><SiteSkipLink/><Header/>{children}<Footer/><MotionObserver/><AnalyticsProvider/></JournalPreferencesProvider></body></html>}
