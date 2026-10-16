"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {assertSourceApproved}=require("../src/source-approval.cjs");

test("requires exact approved tenant, source ID and source URL",async()=>{
 const calls=[];
 const client={async query(sql,params){
   calls.push({sql,params});return {rows:[{classification:"internal"}]};
 }};
 assert.equal(await assertSourceApproved(client,{
   workspace:"tenant-aaaa"
 },{sourceId:"same-source",sourceUrl:"https://example.org/source-alpha"}),"internal");
 assert.deepEqual(calls[0].params,["tenant-aaaa","same-source","https://example.org/source-alpha"]);
 assert.match(calls[0].sql,/expires_at>CURRENT_TIMESTAMP/);
 assert.match(calls[0].sql,/approved=true/);
});
test("rejects absent authorization and invalid source principals",async()=>{
 const client={async query(){return {rows:[]}}};
 await assert.rejects(assertSourceApproved(client,{workspace:"tenant-aaaa"},
   {sourceId:"unknown",sourceUrl:"https://example.org/unknown"}),e=>e.status===403);
 await assert.rejects(assertSourceApproved(client,{workspace:"tenant-aaaa"},
   {sourceId:"unknown"}),e=>e.status===403);
});
