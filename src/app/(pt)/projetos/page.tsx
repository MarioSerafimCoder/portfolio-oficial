import PageView,{metadata as viewMetadata} from '@/views/projects';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata(viewMetadata,"/projetos",'pt');
export default function Page(){return <PageView locale="pt"/>;}
