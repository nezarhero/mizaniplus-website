const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export async function onRequestGet({env}){return json({ready:Boolean(env.RESEND_API_KEY&&env.TURNSTILE_SECRET_KEY&&env.CONTACT_FROM_EMAIL&&env.CONTACT_TURNSTILE_SITE_KEY),siteKey:env.CONTACT_TURNSTILE_SITE_KEY||null});}
export async function onRequestPost({request,env}){
if(!env.RESEND_API_KEY||!env.TURNSTILE_SECRET_KEY||!env.CONTACT_FROM_EMAIL||!env.CONTACT_TURNSTILE_SITE_KEY)return json({error:"not_configured"},503);
const origin=request.headers.get("origin");if(origin&&new URL(origin).hostname!=="mizaniplus.de"&&new URL(origin).hostname!=="www.mizaniplus.de")return json({error:"forbidden"},403);
if(Number(request.headers.get("content-length")||0)>12000)return json({error:"too_large"},413);
let d;try{d=await request.json()}catch{return json({error:"invalid_json"},400)}
const clean=x=>typeof x==="string"?x.trim():"";
const name=clean(d.name),email=clean(d.email),topic=clean(d.topic),message=clean(d.message),token=clean(d.turnstileToken);
const topics=["Allgemeine Frage","Technisches Problem","Feedback / Verbesserungsvorschlag","Premium / Kauf","Datenschutz"];
if(!name||name.length>120||!email||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!topics.includes(topic)||!message||message.length>5000||!token||token.length>3000||clean(d.website))return json({error:"invalid_fields"},400);
const fd=new FormData();fd.set("secret",env.TURNSTILE_SECRET_KEY);fd.set("response",token);fd.set("remoteip",request.headers.get("CF-Connecting-IP")||"");
let check;try{const r=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:fd});check=await r.json()}catch{return json({error:"verification_unavailable"},502)}
if(!check.success||check.hostname&&!["mizaniplus.de","www.mizaniplus.de"].includes(check.hostname))return json({error:"verification_failed"},400);
const safe=s=>s.replace(/[\r\n]/g," ");
const payload={from:env.CONTACT_FROM_EMAIL,to:["support@mizaniplus.de"],reply_to:email,subject:"Mizani Plus – "+topic,text:"Name: "+safe(name)+"\nE-Mail: "+safe(email)+"\nThema: "+topic+"\n\nNachricht:\n"+message};
try{const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"authorization":"Bearer "+env.RESEND_API_KEY,"content-type":"application/json"},body:JSON.stringify(payload)});if(!r.ok){console.error("Contact delivery rejected",JSON.stringify({providerStatus:r.status}));return json({error:"delivery_failed"},502)}return json({ok:true})}catch{return json({error:"delivery_unavailable"},502)}
}
