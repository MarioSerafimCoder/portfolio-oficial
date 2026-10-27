import {EnglishPage,englishMetadata,englishPaths} from '@/i18n/english-pages';
export const dynamicParams=false;
export const generateStaticParams=englishPaths;
type Props={params:Promise<{path?:string[]}>};
export async function generateMetadata({params}:Props){return englishMetadata((await params).path||[]);}
export default async function Page({params}:Props){return <EnglishPage parts={(await params).path||[]}/>;}
