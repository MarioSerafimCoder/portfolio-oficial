import PageView,{metadata as viewMetadata} from '@/views/about';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata(viewMetadata,"/sobre",'pt');
export default function Page(){return <PageView locale="pt"/>;}
