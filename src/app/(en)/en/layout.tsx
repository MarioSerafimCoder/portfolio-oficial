import SiteLayout,{metadata as base} from '@/components/site-layout';
export {viewport} from '@/components/site-layout';
export const metadata={...base,title:{default:'Mário Serafim — Art direction & design',template:'%s — Mário Serafim'},description:'Art direction, visual identity and digital experiences by Mário Serafim, based in Fortaleza, Brazil.',openGraph:{...base.openGraph,locale:'en_US'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="en">{children}</SiteLayout>;}
