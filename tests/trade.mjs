import assert from 'node:assert/strict';
import {initialState} from '../src/shared-state.js';
import {transition,buyers} from '../src/trade.js';
let s=structuredClone(initialState), d={batchId:'OL-2026-0079',buyerId:'BIO-01',rate:65,cost:200};
const act=(a,extra={})=>s=transition(s,a,{...d,...extra});
assert.throws(()=>act('request',{buyerId:'FEED-01'}));act('request');assert.throws(()=>act('request'));assert.throws(()=>act('process'));act('approve');assert.throws(()=>act('dispatch'));act('dispatch',{reference:'DC-1',vehicle:'Demo truck'});assert.throws(()=>act('receive',{reference:'R',party:'Officer',destination:'Wrong',received:38}));act('receive',{reference:'R',party:'Officer',destination:buyers[0].site,received:38});assert.throws(()=>act('process'));act('process',{reference:'P',party:'Officer'});assert.equal(s.batches.find(b=>b.id===d.batchId).status,'Processed');act('settle',{reference:'PAY-1'});assert.equal(s.sales[0].status,'Settled');assert.equal(s.sales[0].received*s.sales[0].rate-s.sales[0].sourceCost-s.sales[0].cost,370);console.log('Trade lifecycle checks passed');
