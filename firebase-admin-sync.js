import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,onAuthStateChanged,signInWithRedirect,getRedirectResult,signOut} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {doc,getFirestore,setDoc} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const config={apiKey:'AIzaSyBPNi8h-XNpwyISUoaDe5tjf4SjL0Z3I1o',authDomain:'cartelera-pastoral-neuqu-cf1dd.firebaseapp.com',projectId:'cartelera-pastoral-neuqu-cf1dd',storageBucket:'cartelera-pastoral-neuqu-cf1dd.firebasestorage.app',messagingSenderId:'117860342876',appId:'1:117860342876:web:e14d816a7fe1ed15d85a99'};
const OWNER='miltong.nqn@gmail.com',app=initializeApp(config),auth=getAuth(app),db=getFirestore(app),button=document.getElementById('firebaseBtn'),status=document.getElementById('firebaseStatus');
let timer=null,syncing=false;
function setStatus(text,ok=false){status.textContent=text;status.style.color=ok?'#86efac':''}
async function syncNow(){if(!auth.currentUser||syncing||!window.getPublicCarteleraData)return;syncing=true;setStatus('Sincronizando…');try{await setDoc(doc(db,'public','cartelera'),window.getPublicCarteleraData());setStatus('Sincronizado ahora',true)}catch(error){console.error(error);setStatus('No se pudo sincronizar')}finally{syncing=false}}
window.queueFirebasePublicSync=()=>{if(!auth.currentUser)return;clearTimeout(timer);timer=setTimeout(syncNow,700)};
button.addEventListener('click',async()=>{try{if(auth.currentUser){await signOut(auth);return}setStatus('Abriendo acceso de Google…');await signInWithRedirect(auth,new GoogleAuthProvider())}catch(error){console.error(error);setStatus(location.protocol==='file:'?'Abre la versión publicada en GitHub':'No se pudo conectar')}});
getRedirectResult(auth).catch(error=>{console.error(error);setStatus('No se pudo completar el acceso')});
onAuthStateChanged(auth,user=>{if(user?.email===OWNER){button.textContent='Desconectar sincronización';setStatus('Conectado · guardado automático',true);syncNow()}else{if(user)signOut(auth);button.textContent='Conectar sincronización';setStatus('Sin conexión')}});
