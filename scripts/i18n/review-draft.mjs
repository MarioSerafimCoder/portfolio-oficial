export function createReviewDraft(slug,source,translation){
 if(!source)throw new Error('REVIEW_SOURCE_MISSING');
 const base=translation?.data||source.fields;
 return {
  body:translation?.body||source.render().body,
  data:{slug,title:base.title,summary:base.summary,seo_title:base.seo_title||base.title,seo_description:base.seo_description||base.summary,cover_alt:base.cover_alt||'',source_hash:source.sourceHash,review_status:'draft'},
 };
}
