import SiteLayout,{fontClassName,metadata as base,viewport as baseViewport} from '@/components/site-layout';
export const viewport=baseViewport;
export const metadata={...base,title:{default:'Mário Serafim — Art direction & design',template:'%s — Mário Serafim'},description:'Art direction, visual identity and digital experiences by Mário Serafim, based in Fortaleza, Brazil.',openGraph:{...base.openGraph,locale:'en_US'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth" className={fontClassName} suppressHydrationWarning><body><SiteLayout>{children}</SiteLayout></body></html>;}
