import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { alert('Por favor, complete todos los campos.'); return; }
    try {
      const res = await fetch('https://gelatitinas-back.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.status === 200) {
        const data = await res.json();
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        alert(data.message);
        history.replace('/home');
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
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} style={{maxWidth:450, margin:'0 auto'}}>
          <header className="head-form">
            <h2>Iniciar Sesion</h2>
            <p>Inicie sesión aquí usando su nombre de usuario y contraseña</p>
          </header>

          <IonItem>
            <IonInput value={email} placeholder="Correo electrónico" type="email" onIonChange={e => setEmail(e.detail.value!)} required />
          </IonItem>

          <IonItem>
            <IonInput value={password} placeholder="Contraseña" type="password" onIonChange={e => setPassword(e.detail.value!)} required />
          </IonItem>

          <div style={{display:'flex', justifyContent:'center', marginTop:12}}>
            <IonButton type="submit">Ingresar</IonButton>
          </div>

          <p style={{textAlign:'center', marginTop:12}}>
            <a href="/register">¿No tienes cuenta? Regístrate</a>
          </p>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
