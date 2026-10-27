import PageView,{metadata as viewMetadata} from '@/views/resources';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata(viewMetadata,"/materiais",'pt');
export default function Page(){return <PageView locale="pt"/>;}
