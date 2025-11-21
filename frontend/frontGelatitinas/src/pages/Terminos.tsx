import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Terminos: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Aviso de Privacidad</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Reusa el HTML que mandaste, simplificado */}
        <h1>🧁 Aviso y Consentimiento de Datos Personales</h1>
        <section>
          <h2>1. Responsable del Tratamiento de Datos Personales</h2>
          <p><strong>[Nombre de la empresa o aplicación]</strong> (“la Aplicación”), ...</p>
        </section>
        {/* Resto del contenido (puedes pegar íntegro si quieres) */}
        <p><strong>Última actualización:</strong> [fecha]</p>
        <p><strong>Contacto:</strong> [correo o número de atención al cliente]</p>
        <IonButton onClick={() => history.goBack()}>Regresar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Terminos;
