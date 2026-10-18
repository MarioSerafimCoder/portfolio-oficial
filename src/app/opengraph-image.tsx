import {ImageResponse} from 'next/og';
export const dynamic='force-static';
export const alt='Mário Serafim — Direção de arte & design';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OG(){return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#140700',color:'#f8f8f7',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'64px'}}><div style={{display:'flex',fontSize:24,letterSpacing:2}}>MÁRIO SERAFIM</div><div style={{display:'flex',fontSize:80,fontFamily:'serif',lineHeight:1.04,maxWidth:900}}>O valor começa na percepção.</div><div style={{display:'flex',fontSize:22}}>Direção de arte & design · Fortaleza, Brasil</div></div>,size)}
