import PageView,{metadata as viewMetadata} from '@/views/contact';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata(viewMetadata,"/contato",'pt');
export default function Page(){return <PageView locale="pt"/>;}
