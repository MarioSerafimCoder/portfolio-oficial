import {ImageResponse} from 'next/og';
export const dynamic='force-static';
export const alt='Mário Serafim — Art direction & design';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OG(){return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#121212',color:'#f3f4f6',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'64px'}}><div style={{display:'flex',fontSize:24,letterSpacing:2}}>MÁRIO SERAFIM</div><div style={{display:'flex',fontSize:78,fontFamily:'serif',lineHeight:1.04,maxWidth:980}}>Your work speaks for you.<br/>So does your brand.</div><div style={{display:'flex',fontSize:22}}>Art direction · Visual identity · Fortaleza</div></div>,size);}
