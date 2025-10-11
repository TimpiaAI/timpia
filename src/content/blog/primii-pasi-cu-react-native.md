---
title: "Primii Pași în React Native: Construiește Prima Ta Aplicație Mobilă"
date: "2024-08-25"
author: "Dezvoltator Mobil"
summary: "Vrei să construiești aplicații pentru iOS și Android cu o singură bază de cod? React Native este soluția. Acest ghid pentru începători te va purta prin configurarea mediului de dezvoltare și crearea primului tău ecran."
coverImage: "https://picsum.photos/seed/react-native-start/1200/600"
coverImageHint: "mobile app development"
tags: ["React Native", "Dezvoltare Mobila", "JavaScript", "Tutorial", "Începători"]
---

Lumea dezvoltării de aplicații mobile poate părea intimidantă, cu două ecosisteme complet diferite (iOS și Android) care necesită, în mod tradițional, limbaje și unelte separate. Aici intervine **React Native**, un framework open-source creat de Facebook care îți permite să construiești aplicații native pentru ambele platforme folosind același limbaj pe care probabil îl cunoști deja: **JavaScript**.

Acest ghid este punctul tău de plecare. Vom parcurge pașii esențiali pentru a-ți configura mediul de dezvoltare și a scrie primele linii de cod pentru aplicația ta.

## De Ce Să Alegi React Native?

*   **O Bază de Cod, Două Platforme:** Scrii cod o singură dată în JavaScript/TypeScript și îl rulezi atât pe iOS, cât și pe Android. Acest lucru reduce dramatic timpul și costurile de dezvoltare.
*   **Performanță Nativă:** Spre deosebire de alte soluții cross-platform care rulează într-un "WebView" (practic, o fereastră de browser), React Native folosește componente native de interfață (UI). Butoanele, textul și vederile tale sunt aceleași componente pe care le-ar folosi o aplicație construită în Swift (iOS) sau Kotlin (Android), oferind o performanță excelentă.
*   **Comunitate Vastă și Ecosistem Matur:** Fiind susținut de Meta și folosit de companii precum Instagram, Shopify și Tesla, React Native are o comunitate imensă, o mulțime de librării și resurse de învățare.
*   **Hot Reloading:** O funcționalitate care îți permite să vezi modificările în aplicație aproape instant, fără a fi nevoie să recompilezi totul. Acest lucru accelerează exponențial ciclul de dezvoltare.

## Pasul 1: Configurarea Mediului de Dezvoltare

Cea mai rapidă cale de a începe cu React Native este folosind **Expo**, o platformă și un set de unelte care simplifică procesul de build și dezvoltare.

**Ce ai nevoie:**
1.  **Node.js (LTS):** Asigură-te că ai instalată o versiune Long-Term Support a Node.js. Poți verifica rulând `node -v` în terminal.
2.  **Un telefon fizic (iOS sau Android):** Vei instala aplicația **Expo Go** din App Store sau Google Play. Aceasta îți va permite să rulezi aplicația direct pe telefon prin scanarea unui cod QR.
3.  **Un editor de cod:** Visual Studio Code este o alegere populară și excelentă.

**Instalarea uneltelor:**
Deschide un terminal (sau Command Prompt pe Windows) și rulează următoarea comandă pentru a instala Expo CLI (Command Line Interface) global pe sistemul tău:

```bash
npm install -g expo-cli
```

## Pasul 2: Crearea Primului Proiect

Acum că ai uneltele necesare, să creăm proiectul.

1.  Navighează în terminal către folderul unde vrei să creezi proiectul.
2.  Rulează comanda de creare:

```bash
npx create-expo-app PrimaMeaAplicatie
```

3.  Așteaptă ca procesul să se finalizeze. Acesta va descărca un template de bază și va instala toate dependențele necesare.
4.  Navighează în folderul nou creat:

```bash
cd PrimaMeaAplicatie
```

## Pasul 3: Rularea Aplicației

Acum vine partea distractivă! Pentru a porni serverul de dezvoltare, rulează comanda:

```bash
npm start
```

Terminalul va afișa un cod QR. Acum:
1.  Deschide aplicația **Expo Go** pe telefonul tău.
2.  Asigură-te că telefonul și calculatorul sunt conectate la **aceeași rețea Wi-Fi**.
3.  Apasă pe "Scan QR Code" în aplicația Expo Go și scanează codul QR din terminal.

În câteva momente, pe ecranul telefonului tău ar trebui să apară ecranul de start al primei tale aplicații React Native!

## Pasul 4: "Hello, World!" în React Native

Hai să facem prima modificare. Deschide proiectul în Visual Studio Code și navighează la fișierul `App.js` (sau `App.tsx` dacă folosești TypeScript).

Vei vedea un cod care arată cam așa:

```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Observă similaritățile cu React pentru web:
*   Folosim **componente** precum `<View>`, `<Text>`. `<View>` este echivalentul unui `<div>`, iar `<Text>` este obligatoriu pentru orice text.
*   Stilizarea se face cu **JavaScript**, folosind `StyleSheet.create`. Proprietățile sunt similare cu CSS, dar scrise în camelCase (ex: `backgroundColor` în loc de `background-color`).

**Modifică textul:** Schimbă linia `<Text>Open up App.js...</Text>` cu:

```javascript
<Text style={styles.title}>Salut, Timpia AI!</Text>
```

**Adaugă un stil nou:** În obiectul `styles`, adaugă un stil pentru titlul nostru:

```javascript
const styles = StyleSheet.create({
  // ... stilul container existent ...
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2', // O culoare mov, specifică Timpia
  },
});
```

Salvează fișierul. Datorită funcționalității "Hot Reloading", ar trebui să vezi modificările apărând instant pe telefonul tău!

## Felicitări!

Ai configurat cu succes mediul de dezvoltare, ai creat și ai rulat prima ta aplicație React Native. Acesta este doar începutul. De aici, poți explora componente mai complexe, navigație între ecrane, preluarea de date de la un API și mult mai multe. Ecosistemul React Native este vast și puternic, iar acum ai fundația necesară pentru a-l explora. Spor la codat!
