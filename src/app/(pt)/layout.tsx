import SiteLayout,{fontClassName,metadata as baseMetadata,viewport as baseViewport} from '@/components/site-layout';
export const metadata=baseMetadata;
export const viewport=baseViewport;
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR" data-scroll-behavior="smooth" className={fontClassName} suppressHydrationWarning><body><SiteLayout>{children}</SiteLayout></body></html>;}
