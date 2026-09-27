import { useEffect, useMemo, useState } from 'react';
import {
  IonApp, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonTitle,
  IonToolbar, IonBadge, IonToast, IonModal, IonText, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { cart, home, logInOutline, logOutOutline, add, createOutline, trashOutline } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { Product, CartItem, User } from './types';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/api';
import { storage } from './services/storage';

function Shell({ children, user, cartCount, logout }: any) {
  const history = useHistory();
  return <>
    <IonMenu contentId="main-content">
      <IonHeader><IonToolbar><IonTitle>ShopApp</IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={() => history.push('/home')}><IonIcon icon={home} slot="start"/><IonLabel>Productos</IonLabel></IonItem>
          <IonItem button onClick={() => history.push('/cart')}><IonIcon icon={cart} slot="start"/><IonLabel>Carrito</IonLabel><IonBadge>{cartCount}</IonBadge></IonItem>
          <IonItem button onClick={logout}><IonIcon icon={logOutOutline} slot="start"/><IonLabel>Cerrar sesión</IonLabel></IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start"/>
          <IonTitle>ShopApp</IonTitle>
          <IonButton fill="clear" slot="end" onClick={() => history.push('/cart')}><IonIcon icon={cart}/><IonBadge>{cartCount}</IonBadge></IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">{children}</IonContent>
    </IonPage>
  </>;
}

function Login({ onLogin }: {onLogin: (u: User) => void}) {
  const [email, setEmail] = useState('usuario@shopapp.com');
  const [password, setPassword] = useState('123456');
  const [toast, setToast] = useState('');
  return <IonPage>
    <IonHeader><IonToolbar><IonTitle>ShopApp - Autenticación</IonTitle></IonToolbar></IonHeader>
    <IonContent className="ion-padding login">
      <div className="login-box">
        <IonIcon icon={logInOutline} className="login-icon"/>
        <h1>Bienvenido</h1>
        <p>Acceso de demostración para la tienda online.</p>
        <IonItem><IonInput label="Correo" labelPlacement="stacked" type="email" value={email} onIonInput={e => setEmail(e.detail.value || '')}/></IonItem>
        <IonItem><IonInput label="Contraseña" labelPlacement="stacked" type="password" value={password} onIonInput={e => setPassword(e.detail.value || '')}/></IonItem>
        <IonButton expand="block" onClick={() => email && password.length >= 4 ? onLogin({email, name: email.split('@')[0]}) : setToast('Ingrese correo y contraseña válidos.')}>Iniciar sesión</IonButton>
      </div>
      <IonToast isOpen={!!toast} message={toast} duration={2500} onDidDismiss={() => setToast('')}/>
    </IonContent>
  </IonPage>;
}

function Home({ addToCart, products, refresh }: {addToCart:(p:Product)=>void, products:Product[], refresh:()=>void}) {
  const [modal, setModal] = useState<Product | null | 'new'>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const save = async (p: any) => {
    try {
      if (modal === 'new') {
        const created = await createProduct(p);
        const next = [...products, {...created, id: Date.now()}];
        storage.setProducts(next); refresh();
      } else if (modal) {
        await updateProduct(modal.id, p);
        const next = products.map(x => x.id === modal.id ? {...x, ...p} : x);
        storage.setProducts(next); refresh();
      }
      setModal(null); setToast('Operación realizada correctamente.');
    } catch { setToast('La API no respondió. Se conserva la información local.'); }
  };
  const remove = async (id:number) => {
    try { await deleteProduct(id); } catch {}
    const next = products.filter(x => x.id !== id); storage.setProducts(next); refresh(); setToast('Producto eliminado.');
  };
  return <>
    <div className="hero"><h1>Tienda online</h1><p>Catálogo conectado a una API con carrito y almacenamiento local.</p></div>
    <IonItem><IonInput label="Buscar" labelPlacement="stacked" placeholder="Nombre del producto" value={search} onIonInput={e=>setSearch(e.detail.value||'')}/></IonItem>
    <IonButton onClick={()=>setModal('new')}><IonIcon icon={add} slot="start"/>Nuevo producto</IonButton>
    <IonGrid><IonRow>
      {filtered.map(p=><IonCol size="12" sizeMd="6" sizeLg="4" key={p.id}>
        <IonCard>
          <img src={p.thumbnail} alt={p.title}/>
          <IonCardHeader><IonCardSubtitle>{p.category}</IonCardSubtitle><IonCardTitle>{p.title}</IonCardTitle></IonCardHeader>
          <IonCardContent><h2>${p.price.toFixed(2)}</h2><p>{p.description}</p>
            <IonButton onClick={()=>addToCart(p)}>Agregar al carrito</IonButton>
            <IonButton fill="clear" onClick={()=>setModal(p)}><IonIcon icon={createOutline}/></IonButton>
            <IonButton fill="clear" color="danger" onClick={()=>remove(p.id)}><IonIcon icon={trashOutline}/></IonButton>
          </IonCardContent>
        </IonCard>
      </IonCol>)}
    </IonRow></IonGrid>
    <ProductModal open={modal!==null} product={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save}/>
    <IonToast isOpen={!!toast} message={toast} duration={2200} onDidDismiss={()=>setToast('')}/>
  </>;
}

function ProductModal({open, product, onClose, onSave}:any) {
  const [title,setTitle]=useState(''); const [price,setPrice]=useState(''); const [description,setDescription]=useState(''); const [category,setCategory]=useState('general'); const [thumbnail,setThumbnail]=useState('https://cdn.dummyjson.com/product-images/1/thumbnail.jpg');
  useEffect(()=>{if(product){setTitle(product.title);setPrice(String(product.price));setDescription(product.description);setCategory(product.category);setThumbnail(product.thumbnail)}else{setTitle('');setPrice('10');setDescription('Producto de demostración');setCategory('general')}},[product,open]);
  return <IonModal isOpen={open} onDidDismiss={onClose}><IonHeader><IonToolbar><IonTitle>{product?'Editar':'Crear'} producto</IonTitle></IonToolbar></IonHeader><IonContent className="ion-padding">
    <IonItem><IonInput label="Nombre" labelPlacement="stacked" value={title} onIonInput={e=>setTitle(e.detail.value||'')}/></IonItem>
    <IonItem><IonInput label="Precio" type="number" labelPlacement="stacked" value={price} onIonInput={e=>setPrice(e.detail.value||'')}/></IonItem>
    <IonItem><IonInput label="Categoría" labelPlacement="stacked" value={category} onIonInput={e=>setCategory(e.detail.value||'')}/></IonItem>
    <IonItem><IonInput label="Descripción" labelPlacement="stacked" value={description} onIonInput={e=>setDescription(e.detail.value||'')}/></IonItem>
    <IonItem><IonInput label="URL imagen" labelPlacement="stacked" value={thumbnail} onIonInput={e=>setThumbnail(e.detail.value||'')}/></IonItem>
    <IonButton expand="block" onClick={()=>onSave({title,price:Number(price),description,category,thumbnail})}>Guardar</IonButton>
    <IonButton expand="block" fill="outline" onClick={onClose}>Cancelar</IonButton>
  </IonContent></IonModal>;
}

function Cart({cartItems,setCart}: {cartItems:CartItem[],setCart:(x:CartItem[])=>void}) {
  const total=cartItems.reduce((s,x)=>s+x.product.price*x.quantity,0);
  const change=(id:number,d:number)=>{const next=cartItems.map(x=>x.product.id===id?{...x,quantity:x.quantity+d}:x).filter(x=>x.quantity>0);setCart(next)};
  return <><h1>Carrito de compras</h1>{cartItems.length===0?<IonText>El carrito está vacío.</IonText>:<IonList>{cartItems.map(x=><IonItem key={x.product.id}><IonLabel><h2>{x.product.title}</h2><p>${x.product.price} × {x.quantity}</p></IonLabel><IonButton onClick={()=>change(x.product.id,-1)}>-</IonButton><IonButton onClick={()=>change(x.product.id,1)}>+</IonButton></IonItem>)}<h2>Total: ${total.toFixed(2)}</h2><IonButton expand="block" onClick={()=>alert('Pedido de demostración generado correctamente.')}>Finalizar compra</IonButton></IonList>}</>;
}

export default function App() {
  const [user,setUser]=useState<User|null>(storage.getUser());
  const [cartItems,setCartItems]=useState<CartItem[]>(storage.getCart());
  const [products,setProducts]=useState<Product[]>(storage.getProducts());
  const [loaded,setLoaded]=useState(products.length>0);
  const refresh=()=>setProducts(storage.getProducts());
  useEffect(()=>{if(!loaded)getProducts().then(p=>{setProducts(p);storage.setProducts(p);setLoaded(true)}).catch(()=>setLoaded(true))},[loaded]);
  const login=(u:User)=>{storage.setUser(u);setUser(u)};
  const logout=()=>{storage.clearUser();setUser(null)};
  const add=(p:Product)=>{const next=cartItems.some(x=>x.product.id===p.id)?cartItems.map(x=>x.product.id===p.id?{...x,quantity:x.quantity+1}:x):[...cartItems,{product:p,quantity:1}];setCartItems(next);storage.setCart(next)};
  const setCart=(x:CartItem[])=>{setCartItems(x);storage.setCart(x)};
  const count=cartItems.reduce((s,x)=>s+x.quantity,0);
  if(!user)return <IonApp><IonReactRouter><Route path="/" component={()=> <Login onLogin={login}/>}/></IonReactRouter></IonApp>;
  return <IonApp><IonReactRouter><Shell user={user} cartCount={count} logout={logout}>
    <IonRouterOutlet><Route exact path="/home" render={()=> <Home addToCart={add} products={products} refresh={refresh}/>}/><Route exact path="/cart" render={()=> <Cart cartItems={cartItems} setCart={setCart}/>}/><Route exact path="/" render={()=> <Redirect to="/home"/>}/></IonRouterOutlet>
  </Shell></IonReactRouter></IonApp>;
}