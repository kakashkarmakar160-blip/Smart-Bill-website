document.addEventListener("DOMContentLoaded",async()=>{
 const client=getClient();
 if(client){
  const [b,p,c]=await Promise.all([client.from("invoices").select("grand_total,created_at"),client.from("products").select("id"),client.from("customers").select("id")]);
  if(!b.error){const today=new Date().toISOString().slice(0,10);const rows=(b.data||[]).filter(x=>(x.created_at||"").slice(0,10)===today);$("todaySales").textContent=money(rows.reduce((s,x)=>s+Number(x.grand_total||0),0));$("todayCount").textContent=rows.length;}
  $("productCount").textContent=p.data?.length??"—";$("customerCount").textContent=c.data?.length??"—";
 }else{
  const bills=localDemo("invoices");const today=new Date().toISOString().slice(0,10);const rows=bills.filter(x=>x.date===today);
  $("todaySales").textContent=money(rows.reduce((s,x)=>s+x.grand_total,0));$("todayCount").textContent=rows.length;$("productCount").textContent=localDemo("products").length;$("customerCount").textContent=localDemo("customers").length;
 }
});