import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import PostreCard from '../components/PostreCard';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem('auth-token');
  const username = localStorage.getItem('username') || 'Usuario';
  const [postres, setPostres] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('todos');

  React.useEffect(() => {
    if (!token) return history.replace('/login');
    (async function obtener() {
      try {
        const res = await fetch('https://gelatitinas-back.vercel.app/api/desserts', {
          headers: { 'Content-Type': 'application/json', 'auth-token': token }
        });
        if (!res.ok) throw new Error('Error al obtener postres');
        const data = await res.json();
        setPostres(data);
      } catch (err:any) {
        console.error(err);
      }
    })();
  }, [token, history]);

  function parseJwt(t:string| null) {
    try { if (!t) return null; return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
  }

  React.useEffect(() => {
    const payload = parseJwt(token);
    if (payload?.role === 'admin') {
      // opcional: mostrar botón admin en la UI
    }
  }, [token]);

  const filtered = postres.filter(p =>
    (category === 'todos' || p.category === category) &&
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio - Gelatitinas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="container">
          <h1>Bienvenido a Gelatitinas</h1>
          <p>Has iniciado sesión correctamente, <strong id="username">{username}</strong>.</p>

          <div className="actions">
            <IonButton onClick={() => { localStorage.clear(); history.replace('/login'); }}>Cerrar sesión</IonButton>
            <IonButton onClick={() => history.push('/admin')}>Panel de Admin</IonButton>
          </div>
        </div>

        <div className="container main-content" style={{marginTop:16}}>
          <div className="content-wrapper">
            <div className="main-section" style={{flex:1}}>
              <div className="search-filters">
                <div className="search-container">
                  <input className="search-input" placeholder="Buscar postres..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>

                <div className="category-filters" id="categoryFilters" style={{marginTop:8}}>
                  {['todos','tartas','helados','pasteles','postres'].map(cat =>
                    <button key={cat} className={`filter-btn ${category===cat ? 'active' : ''}`} onClick={() => setCategory(cat)} style={{textTransform:'capitalize'}}>
                      {cat}
                    </button>
                  )}
                </div>
              </div>

              <div className="results-count">
                <p id="resultsText">Mostrando {filtered.length} de {postres.length} postres</p>
              </div>

              <div className="desserts-grid" id="dessertsGrid">
                {filtered.map(p => <PostreCard key={p._id} p={p} />)}
              </div>

              {filtered.length === 0 && <div className="no-results"><p>No se encontraron postres que coincidan con tu búsqueda.</p></div>}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
