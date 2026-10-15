"use strict";
const { test }=require("node:test");
const assert=require("node:assert/strict");
const {consumeWorkspaceQuota,limits}=require("../src/rate-limit.cjs");

test("enforces fixed tenant and scope quota through parameterized atomic SQL",async()=>{
 for(const [scope,cap] of Object.entries(limits)){
   const calls=[];
   const db={async query(sql,params){
     calls.push({sql,params});return {rows:[{request_count:1}]};
   }};
   assert.equal(await consumeWorkspaceQuota(db,{workspace:"tenant-aaaa",scope}),1);
   assert.deepEqual(calls[0].params,["tenant-aaaa",scope,cap]);
   assert.match(calls[0].sql,/ON CONFLICT/);
   assert.match(calls[0].sql,/request_count<\$3/);
 }
});
test("quota overflow is 429 and cannot mutate the protected operation",async()=>{
 const db={async query(){return {rowCount:0,rows:[]};}};
 await assert.rejects(consumeWorkspaceQuota(db,{workspace:"tenant-aaaa",scope:"knowledge:read"}),
   error=>error.status===429);
 await assert.rejects(consumeWorkspaceQuota(db,{workspace:"tenant-aaaa",scope:"untrusted-scope"}),
   error=>error.status===403);
});
