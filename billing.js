let stream=null, items=[], lastInvoice=null;
const prefs=getPrefs();$("gstRate").value=prefs.gst;$("discountRate").value=prefs.discount;
async function startCamera(){try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});$("video").srcObject=stream;$("ocrStatus").textContent="ক্যামেরা চালু হয়েছে। প্রোডাক্টের লেখা ফ্রেমে ধরুন।";}catch(e){$("ocrStatus").textContent="ক্যামেরা চালু হয়নি: "+e.message;}}
function stopCamera(){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$("video").srcObject=null;}
$("startCamera").onclick=startCamera;$("stopCamera").onclick=stopCamera;
$("capture").onclick=async()=>{
 if(!stream){$("ocrStatus").textContent="আগে ক্যামেরা চালু করুন।";return;}
 const v=$("video"),c=$("canvas");c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);
 $("ocrStatus").textContent="ছবির লেখা পড়া হচ্ছে…";
 try{
  const result=await Tesseract.recognize(c,"eng");
  const text=result.data.text||"";const priceMatches=[...text.matchAll(/(?:MRP|Rs\.?|₹)?\s*([0-9]{1,6}(?:\.[0-9]{1,2})?)/gi)].map(m=>Number(m[1])).filter(n=>n>0);
  const lines=text.split(/\n/).map(x=>x.trim()).filter(Boolean);
  if(lines.length)$("productName").value=lines.find(x=>!/MRP|Rs\.?|₹/i.test(x))||lines[0];
  if(priceMatches.length)$("productPrice").value=priceMatches[priceMatches.length-1];
  $("ocrStatus").textContent="OCR সম্পন্ন। নাম ও দাম যাচাই করে তারপর যোগ করুন। পড়া লেখা: "+text.slice(0,180);
 }catch(e){$("ocrStatus").textContent="OCR করা যায়নি: "+e.message;}
};
function totals(){const sub=items.reduce((s,x)=>s+x.price*x.qty,0);const discRate=prefs.discount;const discount=sub*discRate/100;const taxable=sub-discount;const gstRate=$("billType").value==="gst"?prefs.gst:0;const gst=taxable*gstRate/100;return {subtotal:sub,discount,gst,grand_total:taxable+gst,gst_rate:gstRate,discount_rate:discRate};}
function render(){const body=$("itemsBody");if(!items.length){body.innerHTML='<tr><td colspan="5">এখনও কোনো প্রোডাক্ট যোগ হয়নি।</td></tr>';}else body.innerHTML=items.map((x,i)=>`<tr><td>${escapeHtml(x.name)}</td><td>${x.qty}</td><td>${money(x.price)}</td><td>${money(x.price*x.qty)}</td><td><button class="danger" data-del="${i}">×</button></td></tr>`).join("");
 body.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{items.splice(Number(b.dataset.del),1);render();});const t=totals();$("subtotal").textContent=money(t.subtotal);$("discountAmount").textContent=money(t.discount);$("gstAmount").textContent=money(t.gst);$("grandTotal").textContent=money(t.grand_total);}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("addItem").onclick=()=>{const name=$("productName").value.trim(),price=Number($("productPrice").value),qty=Math.max(1,Number($("productQty").value)||1);if(!name||price<0||!Number.isFinite(price)){alert("প্রোডাক্টের নাম ও সঠিক দাম লিখুন।");return;}items.push({name,price,qty});$("productName").value="";$("productPrice").value="";$("productQty").value=1;render();};
$("totalBill").onclick=render;
$("billType").onchange=render;
$("saveBill").onclick=async()=>{
 if(!items.length){alert("প্রথমে প্রোডাক্ট যোগ করুন।");return;}
 const t=totals(),date=new Date().toISOString(),customerName=$("customerName").value.trim(),customerPhone=$("customerPhone").value.trim();
 const invoice={invoice_number:prefs.prefix+"-"+Date.now(),created_at:date,customer_name:customerName,customer_phone:customerPhone,bill_type:$("billType").value,subtotal:t.subtotal,discount_amount:t.discount,discount_rate:t.discount_rate,gst_amount:t.gst,gst_rate:t.gst_rate,grand_total:t.grand_total,items};
 const client=getClient();
 if(client){
  let customerId=null;
  if(customerPhone && customerName){
    const found=await client.from("customers").select("id").eq("phone",customerPhone).maybeSingle();
    if(found.error){$("saveStatus").textContent="কাস্টমার খুঁজতে সমস্যা: "+found.error.message;return;}
    if(found.data) customerId=found.data.id;
    else {
      const ins=await client.from("customers").insert({name:customerName,phone:customerPhone}).select("id").single();
      if(ins.error){$("saveStatus").textContent="কাস্টমার সেভ হয়নি: "+ins.error.message;return;}
      customerId=ins.data.id;
    }
  }
  const inv=await client.from("invoices").insert({...invoice,customer_id:customerId}).select("id").single();
  if(inv.error){$("saveStatus").textContent="সেভ হয়নি: "+inv.error.message;return;}
  const rows=items.map(x=>({invoice_id:inv.data.id,product_name:x.name,quantity:x.qty,unit_price:x.price,line_total:x.qty*x.price}));
  const insItems=await client.from("invoice_items").insert(rows);if(insItems.error){$("saveStatus").textContent="বিল সেভ হয়েছে, কিন্তু item সেভে সমস্যা: "+insItems.error.message;return;}
  $("saveStatus").textContent="Supabase-এ বিল সেভ হয়েছে: "+invoice.invoice_number;
 }else{
  const arr=localDemo("invoices");arr.push(invoice);saveDemo("invoices",arr);
  $("saveStatus").textContent="ডেমো মোডে এই ব্রাউজারে সেভ হয়েছে (Supabase সংযুক্ত নয়): "+invoice.invoice_number;
 }
 lastInvoice=invoice;
};
$("shareBill").onclick=()=>{
 if(!items.length){alert("আগে বিল তৈরি করুন।");return;}
 const t=totals(),name=$("customerName").value.trim()||"Customer",phone=$("customerPhone").value.replace(/\D/g,"");
 const lines=items.map(x=>`${x.name} × ${x.qty} = ${money(x.price*x.qty)}`).join("\n");
 const msg=`নমস্কার ${name},\nআপনার বিল:\n${lines}\nSubtotal: ${money(t.subtotal)}\nDiscount: ${money(t.discount)}\nGST: ${money(t.gst)}\nসর্বমোট: ${money(t.grand_total)}\nধন্যবাদ।`;
 if(phone){const wa=phone.startsWith("91")?phone:"91"+phone;window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(msg),"_blank");}
 else{navigator.clipboard?.writeText(msg);alert("মোবাইল নম্বর নেই। মেসেজ কপি করার চেষ্টা করা হয়েছে।");}
};
render();
