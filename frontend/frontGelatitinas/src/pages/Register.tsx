import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [acepta, setAcepta] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acepta) { alert('Debes aceptar los términos y condiciones para registrarte'); return; }
    try {
      const res = await fetch('https://gelatitinas-back.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (res.status === 201) {
        const data = await res.json();
        alert(data.message);
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('userId', data.userId);
        history.replace('/login');
      } else {
        const err = await res.text();
        alert(err);
      }
    } catch (err:any) { alert(err.message || err); }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} style={{maxWidth:450, margin:'0 auto'}}>
          <header className="head-form">
            <h2>Registrate</h2>
            <p>¿Aún no te has registrado? Registrate para iniciar sesion </p>
          </header>

          <IonItem>
            <IonInput value={username} placeholder="Usuario" onIonChange={e => setUsername(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonInput value={email} placeholder="Email" type="email" onIonChange={e => setEmail(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonInput value={password} placeholder="Contraseña" type="password" onIonChange={e => setPassword(e.detail.value!)} required />
          </IonItem>

          <label className="checkbox-wrapper" style={{display:'flex', alignItems:'center', gap:8, marginTop:12}}>
            <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} required />
            <span className="text-content">Acepto los <a href="/terminos">términos y condiciones</a></span>
          </label>

          <div style={{display:'flex', justifyContent:'center', marginTop:12}}>
            <IonButton type="submit">Registrarse</IonButton>
          </div>

          <p style={{textAlign:'center', marginTop:12}}>
            <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
          </p>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;
