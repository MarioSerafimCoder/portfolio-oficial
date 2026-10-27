import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import Home,{metadata as homeMetadata} from '@/views/home';
import About,{metadata as aboutMetadata} from '@/views/about';
import Projects,{metadata as projectsMetadata} from '@/views/projects';
import Contact,{metadata as contactMetadata} from '@/views/contact';
import Privacy,{metadata as privacyMetadata} from '@/views/privacy';
import Resources,{metadata as resourcesMetadata} from '@/views/resources';
import Blog,{metadata as blogMetadata} from '@/views/blog';
import Project,{generateMetadata as projectMetadata} from '@/views/project';
import Article,{generateMetadata as articleMetadata} from '@/views/blog-article';
import Category from '@/views/blog-category';
import {projects} from '@/content/projects';
import {visibleJournalPosts,publishedJournalPosts,type JournalCategory} from '@/content/journal';
import {journalCategoryLabels} from '@/content/journal-i18n';
import {localizedMetadata} from './metadata';
import {originalPath} from './routes';
import manifest from './manifest.json';

const pages={
 '':{Component:Home,metadata:homeMetadata},about:{Component:About,metadata:aboutMetadata},projects:{Component:Projects,metadata:projectsMetadata},contact:{Component:Contact,metadata:contactMetadata},privacy:{Component:Privacy,metadata:privacyMetadata},resources:{Component:Resources,metadata:resourcesMetadata},blog:{Component:Blog,metadata:blogMetadata},
};
export function englishPaths(){
 if(!manifest.site)return [{path:['__translation_pending__']}];
 const categories=[...new Set(publishedJournalPosts.filter(post=>post.translations?.en).map(post=>post.category))];
 return [...Object.keys(pages).map(key=>({path:key?key.split('/'):[]})),...projects.map(project=>({path:['projects',project.slug]})),...visibleJournalPosts.filter(post=>post.translations?.en).map(post=>({path:['blog',post.slug]})),...categories.map(category=>({path:['blog','category',category]}))];
}
export async function englishMetadata(parts:string[]):Promise<Metadata>{
 const key=parts.join('/');const page=pages[key as keyof typeof pages];const pathname='/en'+(key?'/'+key:'');
 if(page)return localizedMetadata(page.metadata,originalPath(pathname),'en');
 if(parts[0]==='projects'&&parts.length===2)return localizedMetadata(await projectMetadata({params:Promise.resolve({slug:parts[1]}),locale:'en'}),`/projetos/${parts[1]}`,'en');
 if(parts[0]==='blog'&&parts.length===2)return localizedMetadata(await articleMetadata({params:Promise.resolve({slug:parts[1]}),locale:'en'}),`/blog/${parts[1]}`,'en');
 if(parts[0]==='blog'&&parts[1]==='category'&&parts.length===3){const name=journalCategoryLabels.en[parts[2] as JournalCategory];return localizedMetadata({title:`${name} — Pausa do café`,description:`Articles by Mário Serafim about ${name?.toLowerCase()}.`},`/blog/categoria/${parts[2]}`,'en');}
 return {title:'Translation unavailable',robots:{index:false,follow:true}};
}
export function EnglishPage({parts}:{parts:string[]}){
 if(!manifest.site)notFound();
 const key=parts.join('/');const page=pages[key as keyof typeof pages];
 if(page){const Component=page.Component;return <Component locale="en"/>;}
 if(parts[0]==='projects'&&parts.length===2)return <Project params={Promise.resolve({slug:parts[1]})} locale="en"/>;
 if(parts[0]==='blog'&&parts.length===2)return <Article params={Promise.resolve({slug:parts[1]})} locale="en"/>;
 if(parts[0]==='blog'&&parts[1]==='category'&&parts.length===3)return <Category params={Promise.resolve({slug:parts[2]})} locale="en"/>;
 notFound();
}
