import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AdminPostres: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem('auth-token');
  const [desserts, setDesserts] = React.useState<any[]>([]);
  const [form, setForm] = React.useState<any>({ name:'', category:'', price:'', image:'', description:'', rating:'', ingredients:''});
  const [editId, setEditId] = React.useState<string>('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (!token) history.replace('/login');
    loadDesserts();
  }, [token, history]);

  async function loadDesserts(){
    setMessage('');
    try {
      const res = await fetch('https://gelatitinas-back.vercel.app/api/desserts', { headers: { 'auth-token': token! }});
      if (!res.ok) { setMessage('No se pudieron cargar los postres'); return; }
      const data = await res.json();
      setDesserts(data);
    } catch (err:any) { setMessage('Error de conexión'); }
  }

  async function handleEdit(id:string){
    try {
      const res = await fetch(`https://gelatitinas-back.vercel.app/api/desserts/${id}`, { headers: { 'auth-token': token! }});
      if (!res.ok) return;
      const d = await res.json();
      setEditId(d._id);
      setForm({ name:d.name, category:d.category, price:d.price, image:d.image, description:d.description, rating:d.rating || '', ingredients:d.ingredients ? d.ingredients.join(', ') : '' });
    } catch {}
  }

  async function handleDelete(id:string){
    if (!confirm('¿Seguro que deseas eliminar este postre?')) return;
    try {
      const res = await fetch(`https://gelatitinas-back.vercel.app/api/desserts/${id}`, {
        method:'DELETE', headers: { 'auth-token': token! }
      });
      if (res.ok) { setMessage('Postre eliminado'); loadDesserts(); }
      else setMessage('No se pudo eliminar el postre');
    } catch { setMessage('Error'); }
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `https://gelatitinas-back.vercel.app/api/desserts/${editId}` : 'https://gelatitinas-back.vercel.app/api/desserts';
    const body = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      image: form.image,
      description: form.description,
      rating: form.rating ? parseFloat(form.rating) : undefined,
      ingredients: form.ingredients ? form.ingredients.split(',').map((i:string)=>i.trim()) : []
    };
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type':'application/json', 'auth-token': token! },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setMessage(editId ? 'Postre actualizado' : 'Postre creado');
        setForm({ name:'', category:'', price:'', image:'', description:'', rating:'', ingredients:''});
        setEditId('');
        loadDesserts();
      } else setMessage('Error al guardar el postre');
    } catch { setMessage('Error al conectar'); }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panel de Administración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="container">
          <h1>Panel de Administración de Postres</h1>
          <div style={{display:'flex',gap:8}}>
            <IonButton onClick={() => history.push('/home')}>Volver a inicio</IonButton>
          </div>
          <div id="admin-message">{message}</div>
          <table className="users-table" style={{width:'100%', marginTop:12}}>
            <thead>
              <tr>
                <th>Nombre</th><th>Categoría</th><th>Precio</th><th>Descripción</th><th>Rating</th><th>Ingredientes</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {desserts.map(d => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.category}</td>
                  <td>${Number(d.price).toFixed(2)}</td>
                  <td>{d.description}</td>
                  <td>{d.rating ?? ''}</td>
                  <td>{d.ingredients ? d.ingredients.join(', ') : ''}</td>
                  <td>
                    <button onClick={() => handleEdit(d._id)}>Editar</button>
                    <button onClick={() => handleDelete(d._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{marginTop:16}}>Agregar/Editar Postre</h3>
          <form id="dessert-form" onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:8, maxWidth:640}}>
            <input value={form.name} placeholder="Nombre" onChange={e=>setForm({...form, name:e.target.value})} required />
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} required>
              <option value="">Selecciona una categoría</option>
              <option value="Gelatina">Gelatina</option>
              <option value="Pastel">Pastel</option>
              <option value="Flan">Flan</option>
              <option value="Helado">Helado</option>
              <option value="Pay">Pay</option>
            </select>
            <input value={form.price} placeholder="Precio" type="number" step="0.01" onChange={e=>setForm({...form, price:e.target.value})} required />
            <input value={form.image} placeholder="URL Imagen" onChange={e=>setForm({...form, image:e.target.value})} required />
            <textarea value={form.description} placeholder="Descripción" onChange={e=>setForm({...form, description:e.target.value})} required />
            <input value={form.rating} placeholder="Rating" type="number" step="0.1" min="0" max="5" onChange={e=>setForm({...form, rating:e.target.value})} />
            <input value={form.ingredients} placeholder="Ingredientes (separados por coma)" onChange={e=>setForm({...form, ingredients:e.target.value})} />
            <IonButton type="submit">{editId ? 'Actualizar' : 'Guardar'}</IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminPostres;
