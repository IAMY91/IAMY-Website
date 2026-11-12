const {test}=require('node:test');
const assert=require('node:assert/strict');
const contact=require('../api/contact.js');
const call=async(method,body,headers={})=>{const res={headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(data){this.data=data;return this}};await contact({method,body,headers:{host:'iamy-website.vercel.app',origin:'https://iamy-website.vercel.app','content-type':'application/json',...headers}},res);return res};
test('contact readiness, validation and provider acknowledgement without sending email',async()=>{
 const old={...process.env};const originalFetch=global.fetch;
 try {
  delete process.env.RESEND_API_KEY;delete process.env.CONTACT_FROM_EMAIL;delete process.env.CONTACT_DELIVERY_ENABLED;
  assert.deepEqual((await call('GET')).data,{ready:false});
  assert.equal((await call('POST',{})).code,503);
  process.env.RESEND_API_KEY='test-only';process.env.CONTACT_FROM_EMAIL='Website <test@example.com>';process.env.CONTACT_DELIVERY_ENABLED='true';
  assert.deepEqual((await call('GET')).data,{ready:true});
  let calls=[];global.fetch=async(url,args)=>{calls.push({url,args});return {ok:true,json:async()=>({id:'test-message'})}};
  const valid={name:'Test visitor',email:'test@example.com',message:'Could we discuss team focus?',service:'Team workshop'};
  assert.equal((await call('PUT',valid)).code,405);
  assert.equal((await call('POST',valid,{origin:'https://other.example'})).code,403);
  assert.equal((await call('POST',valid,{'content-type':'text/plain'})).code,415);
  for(const body of [{...valid,email:'invalid'},{...valid,message:''},{...valid,name:'Test\r\nBcc: bad'},{...valid,website:'spam'},{...valid,message:'x'.repeat(6001)}]) assert.equal((await call('POST',body)).code,400);
  assert.equal(calls.length,0);
  assert.equal((await call('POST',valid)).code,200);
  assert.equal((await call('POST',valid)).code,200);
  assert.equal(calls[0].args.headers['Idempotency-Key'],calls[1].args.headers['Idempotency-Key']);
  const email=JSON.parse(calls[0].args.body);assert.deepEqual(email.to,['ilyalex.yacine@gmail.com']);assert.equal(email.reply_to,valid.email);
  global.fetch=async()=>({ok:false,json:async()=>({error:'private provider detail'})});
  const failure=await call('POST',valid);assert.equal(failure.code,502);assert.deepEqual(failure.data,{error:'delivery'});
  global.fetch=async()=>({ok:true,json:async()=>({})});assert.equal((await call('POST',valid)).code,502);
 } finally {global.fetch=originalFetch;for(const key of ['RESEND_API_KEY','CONTACT_FROM_EMAIL','CONTACT_DELIVERY_ENABLED']){if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key]}}
});
