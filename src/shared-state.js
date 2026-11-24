export const STORE_KEY = 'oilloop-prototype-v1';
const now = new Date();
const iso = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0,10); };
export const initialState = {
  restaurants: [
    {id:'RST-1001', name:'The Saffron Table', type:'Restaurant', area:'Hauz Khas, Delhi', contact:'Aarav Mehta', phone:'+91 98710 12001', frequency:'Weekly', status:'Active', lastPickup:iso(-2)},
    {id:'RST-1002', name:'Dilli Darbar Kitchen', type:'Restaurant', area:'Saket, Delhi', contact:'Nisha Kapoor', phone:'+91 98710 12002', frequency:'Twice a week', status:'Active', lastPickup:iso(-1)},
    {id:'RST-1003', name:'Urban Tadka Café', type:'Café', area:'Lajpat Nagar, Delhi', contact:'Kabir Anand', phone:'+91 98710 12003', frequency:'Weekly', status:'Active', lastPickup:iso(-5)},
    {id:'RST-1004', name:'Golden Wok Express', type:'Cloud kitchen', area:'Okhla Phase II, Delhi', contact:'Sana Khan', phone:'+91 98710 12004', frequency:'On demand', status:'Pending verification', lastPickup:'—'},
    {id:'RST-1005', name:'Green Fork Bistro', type:'Restaurant', area:'Greater Kailash, Delhi', contact:'Rohan Sethi', phone:'+91 98710 12005', frequency:'Weekly', status:'Active', lastPickup:iso(-3)},
  ],
  pickups: [
    {id:'PU-26021', restaurantId:'RST-1001', restaurant:'The Saffron Table', area:'Hauz Khas, Delhi', litres:82, kg:75.4, grade:'A', ffa:1.8, tpc:14, water:'Pass', visual:'Clear amber', temperature:32, container:'Sealed HDPE drum', collector:'Ravi Kumar', date:iso(-1), status:'Collected', payout:4104, batchId:'OL-2026-0081', notes:'Two sealed 40L drums'},
    {id:'PU-26020', restaurantId:'RST-1002', restaurant:'Dilli Darbar Kitchen', area:'Saket, Delhi', litres:64, kg:58.9, grade:'B', ffa:3.1, tpc:18, water:'Pass', visual:'Dark amber', temperature:35, container:'Sealed HDPE drum', collector:'Aman Verma', date:iso(-1), status:'In Transit', payout:2944, batchId:'OL-2026-0080', notes:'Pickup verified'},
    {id:'PU-26019', restaurantId:'RST-1003', restaurant:'Urban Tadka Café', area:'Lajpat Nagar, Delhi', litres:38, kg:35, grade:'A', ffa:1.4, tpc:12, water:'Pass', visual:'Clear amber', temperature:29, container:'Sealed HDPE drum', collector:'Ravi Kumar', date:iso(-2), status:'Received at depot', payout:1900, batchId:'OL-2026-0079', notes:'Clean oil, no visible water'},
    {id:'PU-26018', restaurantId:'RST-1005', restaurant:'Green Fork Bistro', area:'Greater Kailash, Delhi', litres:105, kg:96.6, grade:'B', ffa:3.6, tpc:21, water:'Pass', visual:'Brown', temperature:37, container:'IBC tank', collector:'Aman Verma', date:iso(-3), status:'Processed', payout:4830, batchId:'OL-2026-0078', notes:'Combined batch'},
  ],
  bookings: [],
  routes: [
    {id:'RT-041', collector:'Ravi Kumar', vehicle:'DL 1L AB 2841', area:'South Delhi', stops:4, complete:2, status:'In progress', eta:'11:45 AM'},
    {id:'RT-042', collector:'Aman Verma', vehicle:'DL 3C CD 7018', area:'Okhla → Saket', stops:3, complete:1, status:'In progress', eta:'12:20 PM'},
    {id:'RT-043', collector:'Priya Singh', vehicle:'DL 8C EF 9182', area:'Central Delhi', stops:5, complete:5, status:'Completed', eta:'Completed'},
  ],
  batches: [
    {id:'OL-2026-0081', pickupId:'PU-26021', restaurant:'The Saffron Table', litres:82, kg:75.4, grade:'A', status:'Collected', processor:'Awaiting assignment', collected:iso(-1), updated:iso(-1), collector:'Ravi Kumar'},
    {id:'OL-2026-0080', pickupId:'PU-26020', restaurant:'Dilli Darbar Kitchen', litres:64, kg:58.9, grade:'B', status:'In Transit', processor:'Awaiting depot receipt', collected:iso(-1), updated:iso(-1), collector:'Aman Verma'},
    {id:'OL-2026-0079', pickupId:'PU-26019', restaurant:'Urban Tadka Café', litres:38, kg:35, grade:'A', status:'Received at depot', processor:'NCR Biofuels — demo', collected:iso(-2), updated:iso(-2), collector:'Ravi Kumar'},
    {id:'OL-2026-0078', pickupId:'PU-26018', restaurant:'Green Fork Bistro', litres:105, kg:96.6, grade:'B', status:'Processed', processor:'NCR Biofuels — demo', collected:iso(-3), updated:iso(-2), collector:'Aman Verma'},
  ],
  audit: [
    {id:'EVT-0912', title:'Batch OL-2026-0081 collected', detail:'82 L recorded by Ravi Kumar · source acceptance recorded', date:iso(-1), tone:'orange'},
    {id:'EVT-0911', title:'Route RT-041 started', detail:'Vehicle DL 1L AB 2841 · South Delhi', date:iso(-1), tone:'green'},
    {id:'EVT-0910', title:'Depot receipt verified', detail:'Batch OL-2026-0079 · weighment recorded', date:iso(-2), tone:'green'},
  ]
};

export function readLocal() {
  try { const value = JSON.parse(localStorage.getItem(STORE_KEY)); return value && Array.isArray(value.restaurants) ? value : null; } catch { return null; }
}
export function normalize(value) { return Object.fromEntries(Object.entries(initialState).map(([key, fallback]) => [key, Array.isArray(value?.[key]) ? value[key] : fallback])); }
