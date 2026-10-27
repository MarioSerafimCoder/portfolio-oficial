import {fromMarkdown} from 'mdast-util-from-markdown';
const text=node=>node.value||node.children?.map(text).join('')||'';
function headings(tree){const result=[];function walk(node){if(node.type==='heading')result.push(node);node.children?.forEach(walk);}walk(tree);return result;}
/** Translation changes prose, never the fragment identifiers of a published article. */
export function markdownTree(body,sourceBody=body){
 const tree=fromMarkdown(body);const original=headings(fromMarkdown(sourceBody));const counts=new Map();
 const ids=original.map(node=>{const base=text(node).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'secao';const count=(counts.get(base)||0)+1;counts.set(base,count);return count===1?base:`${base}-${count}`;});
 headings(tree).forEach((node,index)=>{node.id=ids[index];});return tree;
}
