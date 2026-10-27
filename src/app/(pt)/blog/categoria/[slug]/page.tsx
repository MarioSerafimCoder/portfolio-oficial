import PageView,{generateMetadata as viewMetadata} from '@/views/blog-category';
import {localizedMetadata} from '@/i18n/metadata';
export const dynamicParams=false;
export {generateStaticParams} from '@/views/blog-category';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata(props:Props){const {slug}=await props.params;return localizedMetadata(await viewMetadata(props),"/blog/categoria/"+slug,'pt');}
export default function Page(props:Props){return <PageView {...props} locale="pt"/>;}
