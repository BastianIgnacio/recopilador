export const UserRole = {
  Admin: 0,
  Editor: 1,
};

/*
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuTypeBackApp = 'menu-default';
export const defaultMenuTypeClientApp = 'menu-hidden h-100';
/*
export const wsAPI1 = 'ws://192.168.50.24:8000/ws/';
export const wsAPI2 = 'ws://192.168.50.24:8001/ws/';


export const wsAPI1 = 'ws://172.16.73.161:8000/ws/';
export const wsAPI2 = 'ws://172.16.73.161:8001/ws/';

export const wsAPI1 = 'ws://127.0.0.1:8000/ws/';
export const wsAPI2 = 'ws://172.16.70.11:8001/ws/';

export const wsAPI1 = 'ws://192.168.3.58:8000/ws/';
export const wsAPI2 = 'ws://192.168.3.58:8001/ws/';

export const wsAPI1 = 'ws://127.0.0.1:8000/ws/';
export const wsAPI2 = 'ws://127.0.0.1:8001/ws/';
*/

export const wsAPI1 = 'ws://192.168.3.58:8000/ws/';
export const wsAPI2 = 'ws://192.168.3.58:8001/ws/';

export const jugadores = [
  { client_id: 0, letra: 'A', equipo: 'AZUL' },
  { client_id: 1, letra: 'B', equipo: 'AMARILLO' },
  { client_id: 2, letra: 'C', equipo: 'AZUL' },
];
export const vistasOptions = [
  { label: 'BIENVENIDO', value: 'MOSTRAR_BIENVENIDO' },
  {
    label: 'INICIAR_ACTIVIDAD',
    value: 'MOSTRAR_INICIAR_ACTIVIDAD',
  },
  {
    label: 'ASIGNAR_CREDITOS',
    value: 'MOSTRAR_ASIGNAR_CREDITOS',
  },
  {
    label: 'DETALLE_ASIGNACION_CREDITOS',
    value: 'MOSTRAR_ASIGNACION_CREDITOS',
  },
  { label: 'VOTAR_EXCLUIR', value: 'MOSTRAR_VOTAR_EXCLUIR' },
  { label: 'RESULTADO_EXCLUSION', value: 'MOSTRAR_RESULTADO_EXCLUSION' },
  { label: 'VOTA_INCLUIR', value: 'MOSTRAR_VOTAR_INCLUIR' },
  { label: 'RESULTADO_INCLUSION', value: 'MOSTRAR_RESULTADO_INCLUSION' },
  { label: 'RESUMEN_ACTIVIDAD', value: 'MOSTRAR_RESUMEN_ACTIVIDAD' },
  { label: 'RESUMEN_SESION', value: 'MOSTRAR_RESUMEN_SESION' },
  { label: 'ENCUESTA', value: 'MOSTRAR_ENCUESTA' },
  { label: 'AGRADECIMIENTOS', value: 'MOSTRAR_AGRADECIMIENTOS' },
];

export const tratamientosOptions = [
  { label: 'Trat. 1', value: 'T1', description: 'Baseline' },
  { label: 'Trat. 2', value: 'T2', description: 'Exclusion Cost' },
  {
    label: 'Trat. 3',
    value: 'T3',
    description: 'Exclusion Cost + Congestion Cost',
  },
  { label: 'Trat. 4', value: 'T4', description: 'Congestion Cost' },
];

export const equipos = [
  {
    id: 0,
    color: '#F5C400',
    colorLight: '#FFF7D7',
    club: 'AMARILLO',
    colorLetra: 'black',
  },
  {
    id: 1,
    color: '#001840',
    colorLight: '#D7E7FF',
    club: 'AZUL',
    colorLetra: 'white',
  },
];

export const colorOrange = '#ffaa00';
export const colorBlue = '#001840';
export const colorLightBlue = '#D7E7FF';

export const colorYellow = '#F5C400';
export const colorLightYellow = '#FFF7D7';
export const colorAmarilloEliminado = '#f7ff00';

export const colorCrema = '#FFFDF0';
export const colorPlomo = '#E3E3E3';

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = 'en';
export const localeOptions = [
  { id: 'en', name: 'English - LTR', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'enrtl', name: 'English - RTL', direction: 'rtl' },
];

export const firebaseConfig = {
  apiKey: 'AIzaSyBBksq-Asxq2M4Ot-75X19IyrEYJqNBPcg',
  authDomain: 'gogo-react-login.firebaseapp.com',
  databaseURL: 'https://gogo-react-login.firebaseio.com',
  projectId: 'gogo-react-login',
  storageBucket: 'gogo-react-login.appspot.com',
  messagingSenderId: '216495999563',
};

export const adminRoot = '/app';
export const buyUrl = 'https://1.envato.market/k4z0';
export const searchPath = `${adminRoot}/#`;
export const servicePath = 'https://api.coloredstrategies.com';

export const currentUser = {
  id: 1,
  title: 'Sarah Kortney',
  img: '/assets/img/profiles/l-1.jpg',
  date: 'Last seen today 15:24',
  role: UserRole.Admin,
};

export const themeColorStorageKey = '__theme_selected_color';
export const isMultiColorActive = true;
export const defaultColor = 'light.purplemonster';
export const isDarkSwitchActive = true;
export const defaultDirection = 'ltr';
export const themeRadiusStorageKey = '__theme_radius';
export const isAuthGuardActive = true;
export const colors = [
  'bluenavy',
  'blueyale',
  'blueolympic',
  'greenmoss',
  'greenlime',
  'purplemonster',
  'orangecarrot',
  'redruby',
  'yellowgranola',
  'greysteel',
];

export const comunas = [
  { value: 'ARAUCO', key: 1 },
  { value: 'CORONEL', key: 2 },
  { value: 'COBQUECURA', key: 3 },
  { value: 'COELEMU', key: 4 },
  { value: 'HUALPEN', key: 5 },
  { value: 'LEBU', key: 6 },
  { value: 'LOTA', key: 7 },
  { value: 'PENCO', key: 8 },
  { value: 'SAN PEDRO DE LA PAZ', key: 9 },
  { value: 'TALCAHUANO', key: 10 },
  { value: 'TREGUACO', key: 11 },
  { value: 'TOME', key: 12 },
  { value: 'OTRA', key: 13 },
];
