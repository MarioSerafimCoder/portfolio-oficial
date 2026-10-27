import PageView,{metadata as viewMetadata} from '@/views/privacy';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata(viewMetadata,"/privacidade",'pt');
export default function Page(){return <PageView locale="pt"/>;}
