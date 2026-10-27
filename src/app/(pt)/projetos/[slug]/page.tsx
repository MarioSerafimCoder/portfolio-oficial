import PageView,{generateMetadata as viewMetadata} from '@/views/project';
import {localizedMetadata} from '@/i18n/metadata';
export const dynamicParams=false;
export {generateStaticParams} from '@/views/project';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata(props:Props){const {slug}=await props.params;return localizedMetadata(await viewMetadata(props),"/projetos/"+slug,'pt');}
export default function Page(props:Props){return <PageView {...props} locale="pt"/>;}
