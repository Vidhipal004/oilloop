export const buyers = [
{id:'BIO-01',name:'NCR Biofuels (demo)',type:'Biodiesel manufacturer',site:'Manesar, Haryana (demo)',eligible:true},
{id:'SAF-01',name:'Sky Circular Fuels (demo)',type:'SAF producer',site:'Panipat, Haryana (demo)',eligible:true},
{id:'OLE-01',name:'Circular Oleochemicals (demo)',type:'Oleochemical company',site:'Faridabad, Haryana (demo)',eligible:true},
{id:'FEED-01',name:'Feed sector (conditional)',type:'Animal-feed player',site:'Not approved',eligible:false}];
export function transition(state, action, d){
 const s=structuredClone(state), fail=m=>{throw Error(m)}, required=(...keys)=>keys.forEach(k=>{if(!String(d[k]??'').trim())fail('Required: '+k)}), stamp=new Date().toISOString();
 const b=s.batches.find(x=>x.id===d.batchId), buyer=buyers.find(x=>x.id===d.buyerId); if(!b||!buyer?.eligible)fail('Select an eligible buyer and batch.');
 let o=s.sales.find(x=>x.batchId===b.id && x.status!=='Rejected');
 if(action==='request'){
 if(b.status!=='Received at depot'||o)fail('Batch is not available.');
 const p=s.pickups.find(x=>x.batchId===b.id), rate=Number(d.rate), cost=Number(d.cost); if(!Number.isFinite(rate)||rate<=0||!Number.isFinite(cost)||cost<0||!Number.isFinite(Number(b.litres))||Number(b.litres)<=0)fail('Invalid quantity, price or cost.');
 o={id:'SALE-'+Date.now(),batchId:b.id,buyerId:buyer.id,buyer:buyer.name,destination:buyer.site,litres:Number(b.litres),rate,cost,sourceCost:p?.payout==null?null:Number(p.payout),status:'Requested',history:[]};s.sales.unshift(o);
 }else{
 if(!o||o.buyerId!==buyer.id)fail('Order does not belong to this buyer.');
 const expected={approve:'Requested',reject:'Requested',dispatch:'Approved',receive:'Dispatched',process:'Delivered',settle:'Processed'};if(o.status!==expected[action])fail('Invalid order stage.');
 if(action==='approve')o.status='Approved';
 if(action==='reject')o.status='Rejected';
 if(action==='dispatch'){required('reference','vehicle');o.dispatchRef=d.reference;o.vehicle=d.vehicle;o.status='Dispatched';}
 if(action==='receive'){required('reference','party','destination');if(d.destination.trim()!==o.destination)fail('Destination does not match assigned facility.');const qty=Number(d.received);if(!Number.isFinite(qty)||qty<=0||qty!==o.litres)fail('Received litres must match dispatched litres; discrepancies require manual reconciliation before confirmation.');o.received=qty;o.receiptRef=d.reference;o.receiver=d.party;o.status='Delivered';}
 if(action==='process'){required('reference','party');o.processingRef=d.reference;o.processor=d.party;o.status='Processed';b.status='Processed';b.processor=buyer.name;b.updated=stamp.slice(0,10);b.custodyHistory=[...(b.custodyHistory||[]),{status:'Delivered',reference:o.receiptRef,party:o.receiver,date:o.history.find(h=>h.action==='receive')?.date},{status:'Processed',reference:d.reference,party:d.party,date:stamp}];s.pickups=s.pickups.map(p=>p.batchId===b.id?{...p,status:'Processed'}:p);}
 if(action==='settle'){required('reference');o.paymentRef=d.reference;o.status='Settled';}
 }
 o.history.push({action,date:stamp,actor:['request','receive','process'].includes(action)?buyer.name:'Operations Admin',reference:d.reference||''});s.audit.unshift({id:'EVT-'+Date.now(),title:o.id+' · '+o.status,detail:b.id+' · '+buyer.name,date:stamp.slice(0,10),tone:'green'});return s;
}

export function submitInquiry(state, d) {
 const buyer=buyers.find(b=>b.id===d.buyerId), litres=Number(d.litres);
 if(!buyer?.eligible || !Number.isFinite(litres) || litres<=0 || !String(d.contact||'').trim() || !String(d.needBy||'').match(/^\d{4}-\d{2}-\d{2}$/) || !['Any','A','B'].includes(d.grade)) throw Error('Enter a valid buyer, quantity, grade, date and contact.');
 const s=structuredClone(state); s.inquiries=[{id:'INQ-'+Date.now(),buyerId:buyer.id,buyer:buyer.name,litres,grade:d.grade,needBy:d.needBy,contact:String(d.contact).trim(),notes:String(d.notes||'').trim(),status:'New',reply:'',date:new Date().toISOString()},...(s.inquiries||[])]; return s;
}
export function replyInquiry(state,id,reply){const s=structuredClone(state), q=s.inquiries.find(x=>x.id===id);if(!q||!String(reply||'').trim())throw Error('Enter a response.');q.reply=String(reply).trim();q.status='Responded';return s;}
