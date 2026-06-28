'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const CATS = ['Fruits & Vegetables','Dairy & Eggs','Bakery & Bread','Pantry & Dry Goods','Meat & Seafood','Beverages','Snacks & Confectionery'];
const DEF = { name:'',slug:'',category:'Fruits & Vegetables',subcategory:'',price:'',originalPrice:'',discount:'',unit:'',weight:'',stock:'',rating:'4.5',reviews:'0',description:'',highlights:'',image:'',images:'',tags:'',isFlashSale:false,isNewArrival:false,isFeatured:false,isBestSeller:false,isOrganic:false,cal:'',fat:'',carbs:'',protein:'',fiber:'' };

export default function ProductForm({ initial={}, mode='add', productId }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    ...DEF, ...initial,
    highlights: Array.isArray(initial.highlights) ? initial.highlights.join('\n') : initial.highlights||'',
    images:     Array.isArray(initial.images)     ? initial.images.join('\n')     : initial.images||'',
    tags:       Array.isArray(initial.tags)       ? initial.tags.join(', ')       : initial.tags||'',
    cal:initial.nutrition?.calories||'', fat:initial.nutrition?.fat||'', carbs:initial.nutrition?.carbs||'', protein:initial.nutrition?.protein||'', fiber:initial.nutrition?.fiber||'',
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const autoSlug = n => n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()||!form.price){toast.error('Name and price are required');return;}
    setSaving(true);
    const payload = {
      name:form.name.trim(), slug:form.slug||autoSlug(form.name), category:form.category, subcategory:form.subcategory,
      price:parseFloat(form.price), originalPrice:form.originalPrice?parseFloat(form.originalPrice):undefined,
      discount:form.discount?parseInt(form.discount):undefined, unit:form.unit, weight:form.weight,
      stock:parseInt(form.stock)||0, rating:parseFloat(form.rating)||4.5, reviews:parseInt(form.reviews)||0,
      description:form.description,
      highlights:form.highlights.split('\n').map(s=>s.trim()).filter(Boolean),
      image:form.image, images:form.images.split('\n').map(s=>s.trim()).filter(Boolean),
      tags:form.tags.split(',').map(s=>s.trim()).filter(Boolean),
      isFlashSale:form.isFlashSale, isNewArrival:form.isNewArrival, isFeatured:form.isFeatured, isBestSeller:form.isBestSeller, isOrganic:form.isOrganic,
      nutrition:{calories:form.cal,fat:form.fat,carbs:form.carbs,protein:form.protein,fiber:form.fiber},
      isActive:true,
    };
    try {
      const r = await fetch(mode==='edit'?`/api/products/${productId}`:'/api/products',{method:mode==='edit'?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if (!r.ok) throw new Error();
      toast.success(mode==='edit'?'Product updated!':'Product added!');
      router.push('/admin/goingintodeep/products');
    } catch { toast.error('Could not save — check MongoDB is connected.'); }
    setSaving(false);
  };

  const Field = ({ label, k, type='text', ph='', req, hint, half }) => (
    <div style={{ gridColumn:half?'auto':'1/-1' }}>
      <label style={{ display:'block',fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>
        {label}{req&&<span style={{color:'#e74c3c'}}> *</span>}
      </label>
      <input type={type} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} required={req} className="input"/>
      {hint&&<p style={{fontSize:'0.75rem',color:'var(--muted)',marginTop:'0.25rem'}}>{hint}</p>}
    </div>
  );

  const Toggle = ({ label, k }) => (
    <label style={{ display:'flex',alignItems:'center',gap:'0.75rem',cursor:'pointer' }}>
      <button type="button" className="toggle" onClick={()=>set(k,!form[k])}
        style={{ background:form[k]?'var(--violet)':'var(--hairline)',position:'relative' }}>
        <div className="toggle-knob" style={{ left:form[k]?20:2 }}/>
      </button>
      <span style={{ fontSize:'0.9375rem',fontWeight:500 }}>{label}</span>
    </label>
  );

  const Card = ({ title, children }) => (
    <div className="admin-card" style={{ padding:'1.5rem',marginBottom:'1rem' }}>
      <h3 style={{ fontSize:'1rem',fontWeight:700,letterSpacing:'-0.02em',marginBottom:'1.25rem',paddingBottom:'1rem',borderBottom:'1px solid var(--hairline)' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <form onSubmit={submit}>
      <Card title="Basic Information">
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
          <div style={{ gridColumn:'1/-1' }}><Field label="Product Name" k="name" req ph="e.g. Organic Hass Avocados"/></div>
          <Field label="URL Slug" k="slug" ph="auto-generated" hint="Leave blank to auto-generate" half/>
          <div>
            <label style={{ display:'block',fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>Category *</label>
            <select value={form.category} onChange={e=>set('category',e.target.value)} className="input">
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Subcategory" k="subcategory" ph="e.g. Fruits" half/>
          <Field label="Unit" k="unit" ph="e.g. pack of 4" half/>
          <Field label="Weight/Volume" k="weight" ph="e.g. 600g" half/>
        </div>
      </Card>

      <Card title="Pricing & Inventory">
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem' }}>
          <Field label="Sale Price (£)" k="price" type="number" req ph="4.99" half/>
          <Field label="Original Price (£)" k="originalPrice" type="number" ph="6.99" half/>
          <Field label="Discount %" k="discount" type="number" ph="29" half/>
          <Field label="Stock Qty" k="stock" type="number" ph="50" half/>
        </div>
      </Card>

      <Card title="Images">
        <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
          <Field label="Main Image URL" k="image" ph="https://images.unsplash.com/..."/>
          <div>
            <label style={{ display:'block',fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>Additional Images (one per line)</label>
            <textarea value={form.images} onChange={e=>set('images',e.target.value)} rows={3} className="input" style={{resize:'vertical'}} placeholder="https://images.unsplash.com/..."/>
          </div>
          {form.image&&<div style={{width:80,height:80,borderRadius:12,overflow:'hidden',background:'var(--canvas)'}}><img src={form.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/></div>}
        </div>
      </Card>

      <Card title="Description & Content">
        <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
          <div>
            <label style={{ display:'block',fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>Description</label>
            <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={4} className="input" style={{resize:'vertical'}} placeholder="Detailed product description..."/>
          </div>
          <div>
            <label style={{ display:'block',fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>Highlights (one per line)</label>
            <textarea value={form.highlights} onChange={e=>set('highlights',e.target.value)} rows={4} className="input" style={{resize:'vertical'}} placeholder={"Certified organic\nRich in Omega-3"}/>
          </div>
          <Field label="Tags (comma separated)" k="tags" ph="organic, vegan, keto"/>
        </div>
      </Card>

      <Card title="Nutrition (per 100g)">
        <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'0.875rem' }}>
          {[['cal','Calories','160'],['fat','Fat','15g'],['carbs','Carbs','9g'],['protein','Protein','2g'],['fiber','Fibre','7g']].map(([k,l,ph])=>(
            <div key={k}>
              <label style={{ display:'block',fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>{l}</label>
              <input type="text" value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} className="input"/>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rating & Reviews">
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
          <Field label="Rating (0–5)" k="rating" type="number" ph="4.5" half/>
          <Field label="Review Count" k="reviews" type="number" ph="124" half/>
        </div>
      </Card>

      <Card title="Product Flags">
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem' }}>
          <Toggle label="Flash Sale"   k="isFlashSale"/>
          <Toggle label="New Arrival"  k="isNewArrival"/>
          <Toggle label="Featured"     k="isFeatured"/>
          <Toggle label="Best Seller"  k="isBestSeller"/>
          <Toggle label="Organic"      k="isOrganic"/>
        </div>
      </Card>

      <div style={{ display:'flex',gap:'0.75rem',paddingBottom:'2rem' }}>
        <button type="submit" disabled={saving}
          style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'var(--violet)',color:'#fff',borderRadius:100,padding:'0.875rem 2rem',fontSize:'0.9375rem',fontWeight:700,border:'none',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,boxShadow:'var(--violet-glow)',transition:'all 0.2s',fontFamily:'inherit' }}>
          {saving?<><Loader size={16} className="spin"/> Saving...</>:<><Save size={16}/>{mode==='edit'?'Update Product':'Add Product'}</>}
        </button>
        <button type="button" onClick={()=>router.back()}
          style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'#fff',color:'var(--ink)',borderRadius:100,padding:'0.875rem 1.75rem',fontSize:'0.9375rem',border:'1.5px solid var(--hairline)',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
