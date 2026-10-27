import PageView,{metadata as viewMetadata} from '@/views/home';
import {localizedMetadata} from '@/i18n/metadata';
export const metadata=localizedMetadata(viewMetadata,"/",'pt');
export default function Page(){return <PageView locale="pt"/>;}
