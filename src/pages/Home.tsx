import {IonButton, IonContent, IonHeader, IonIcon, IonPage, IonToolbar} from '@ionic/react';
import './Home.css';
import MyMap from "../components/map";
import {useStorage} from "../components/useStorage";
import {useEffect} from "react";
import {StatusBar} from "@capacitor/status-bar";
import {refresh} from 'ionicons/icons';

const Home = () => {
    const {updateData} = useStorage();

    useEffect(() => {
        StatusBar.setOverlaysWebView({overlay: false}).catch(() => undefined);
        updateData();
    }, [])

  return (
      <IonPage>
          <IonContent fullscreen>
              <MyMap/>
          </IonContent>
      </IonPage>
  );
};

export default Home;
