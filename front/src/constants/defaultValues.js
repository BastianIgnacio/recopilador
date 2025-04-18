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

export const wsAPI1 = 'ws://192.168.50.24:8000/ws/';
export const wsAPI2 = 'ws://192.168.50.24:8001/ws/';

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

export const regionesChile = [
  {
    region: 'Arica y Parinacota',
    numero: 'XV',
    comunas: ['Arica', 'Camarones', 'General Lagos', 'Putre'],
  },
  {
    region: 'Tarapacá',
    numero: 'I',
    comunas: [
      'Alto Hospicio',
      'Camiña',
      'Colchane',
      'Huara',
      'Iquique',
      'Pica',
      'Pozo Almonte',
    ],
  },
  {
    region: 'Antofagasta',
    numero: 'II',
    comunas: [
      'Antofagasta',
      'Calama',
      'María Elena',
      'Mejillones',
      'Ollagüe',
      'San Pedro de Atacama',
      'Sierra Gorda',
      'Taltal',
      'Tocopilla',
    ],
  },
  {
    region: 'Atacama',
    numero: 'III',
    comunas: [
      'Alto del Carmen',
      'Caldera',
      'Chañaral',
      'Copiapó',
      'Diego de Almagro',
      'Freirina',
      'Huasco',
      'Tierra Amarilla',
      'Vallenar',
    ],
  },
  {
    region: 'Coquimbo',
    numero: 'IV',
    comunas: [
      'Andacollo',
      'Canela',
      'Combarbalá',
      'Coquimbo',
      'Illapel',
      'La Higuera',
      'La Serena',
      'Los Vilos',
      'Monte Patria',
      'Ovalle',
      'Paiguano',
      'Punitaqui',
      'Río Hurtado',
      'Salamanca',
      'Vicuña',
    ],
  },
  {
    region: 'Valparaíso',
    numero: 'V',
    comunas: [
      'Algarrobo',
      'Cabildo',
      'Calera',
      'Calle Larga',
      'Cartagena',
      'Casablanca',
      'Catemu',
      'Concón',
      'El Quisco',
      'El Tabo',
      'Hijuelas',
      'Isla de Pascua',
      'Juan Fernández',
      'La Cruz',
      'La Ligua',
      'Limache',
      'Llaillay',
      'Los Andes',
      'Nogales',
      'Olmué',
      'Panquehue',
      'Papudo',
      'Petorca',
      'Puchuncaví',
      'Putaendo',
      'Quillota',
      'Quilpué',
      'Quintero',
      'Rinconada',
      'San Antonio',
      'San Esteban',
      'San Felipe',
      'Santa María',
      'Santo Domingo',
      'Valparaíso',
      'Villa Alemana',
      'Viña del Mar',
      'Zapallar',
    ],
  },
  {
    region: 'Metropolitana de Santiago',
    numero: 'MET',
    comunas: [
      'Alhué',
      'Buin',
      'Calera de Tango',
      'Cerrillos',
      'Cerro Navia',
      'Colina',
      'Conchalí',
      'Curacaví',
      'El Bosque',
      'El Monte',
      'Estación Central',
      'Huechuraba',
      'Independencia',
      'Isla de Maipo',
      'La Cisterna',
      'La Florida',
      'La Granja',
      'La Pintana',
      'La Reina',
      'Lampa',
      'Las Condes',
      'Lo Barnechea',
      'Lo Espejo',
      'Lo Prado',
      'Macul',
      'Maipú',
      'María Pinto',
      'Melipilla',
      'Ñuñoa',
      'Padre Hurtado',
      'Paine',
      'Pedro Aguirre Cerda',
      'Peñaflor',
      'Peñalolén',
      'Pirque',
      'Providencia',
      'Pudahuel',
      'Puente Alto',
      'Quilicura',
      'Quinta Normal',
      'Recoleta',
      'Renca',
      'San Bernardo',
      'San Joaquín',
      'San José de Maipo',
      'San Miguel',
      'San Pedro',
      'San Ramón',
      'Santiago',
      'Talagante',
      'Tiltil',
      'Vitacura',
    ],
  },
  {
    region: 'Libertador Gral. Bernardo O’Higgins',
    numero: 'VI',
    comunas: [
      'Chimbarongo',
      'Chépica',
      'Codegua',
      'Coinco',
      'Coltauco',
      'Doñihue',
      'Graneros',
      'La Estrella',
      'Las Cabras',
      'Litueche',
      'Lolol',
      'Machalí',
      'Malloa',
      'Marchihue',
      'Nancagua',
      'Navidad',
      'Olivar',
      'Palmilla',
      'Paredones',
      'Peralillo',
      'Peumo',
      'Pichidegua',
      'Pichilemu',
      'Placilla',
      'Pumanque',
      'Quinta de Tilcoco',
      'Rancagua',
      'Rengo',
      'Requínoa',
      'San Fernando',
      'San Francisco de Mostazal',
      'San Vicente de Tagua Tagua',
      'Santa Cruz',
    ],
  },
  {
    region: 'Maule',
    numero: 'VII',
    comunas: [
      'Cauquenes',
      'Chanco',
      'Colbún',
      'Constitución',
      'Curepto',
      'Curicó',
      'Empedrado',
      'Hualañé',
      'Licantén',
      'Linares',
      'Longaví',
      'Maule',
      'Molina',
      'Parral',
      'Pelarco',
      'Pelluhue',
      'Pencahue',
      'Rauco',
      'Retiro',
      'Romeral',
      'Río Claro',
      'Sagrada Familia',
      'San Clemente',
      'San Javier de Loncomilla',
      'San Rafael',
      'Talca',
      'Teno',
      'Vichuquén',
      'Villa Alegre',
      'Yerbas Buenas',
    ],
  },
  {
    region: 'Ñuble',
    numero: 'XVI',
    comunas: [
      'Bulnes',
      'Chillán Viejo',
      'Chillán',
      'Cobquecura',
      'Coelemu',
      'Coihueco',
      'El Carmen',
      'Ninhue',
      'Ñiquén',
      'Pemuco',
      'Pinto',
      'Portezuelo',
      'Quillón',
      'Quirihue',
      'Ránquil',
      'San Carlos',
      'San Fabián',
      'San Ignacio',
      'San Nicolás',
      'Treguaco',
      'Yungay',
    ],
  },
  {
    region: 'Biobío',
    numero: 'VIII',
    comunas: [
      'Alto Biobío',
      'Antuco',
      'Arauco',
      'Cabrero',
      'Cañete',
      'Chiguayante',
      'Concepción',
      'Contulmo',
      'Coronel',
      'Curanilahue',
      'Florida',
      'Hualpén',
      'Hualqui',
      'Laja',
      'Lebu',
      'Los Álamos',
      'Los Ángeles',
      'Lota',
      'Mulchén',
      'Nacimiento',
      'Negrete',
      'Penco',
      'Quilaco',
      'Quilleco',
      'San Pedro de la Paz',
      'San Rosendo',
      'Santa Bárbara',
      'Santa Juana',
      'Talcahuano',
      'Tirúa',
      'Tomé',
      'Tucapel',
      'Yumbel',
    ],
  },
  {
    region: 'Araucanía',
    numero: 'IX',
    comunas: [
      'Angol',
      'Carahue',
      'Cholchol',
      'Collipulli',
      'Cunco',
      'Curacautín',
      'Curarrehue',
      'Ercilla',
      'Freire',
      'Galvarino',
      'Gorbea',
      'Lautaro',
      'Loncoche',
      'Lonquimay',
      'Los Sauces',
      'Lumaco',
      'Melipeuco',
      'Nueva Imperial',
      'Padre las Casas',
      'Perquenco',
      'Pitrufquén',
      'Pucón',
      'Purén',
      'Renaico',
      'Saavedra',
      'Temuco',
      'Teodoro Schmidt',
      'Toltén',
      'Traiguén',
      'Victoria',
      'Vilcún',
      'Villarrica',
    ],
  },
  {
    region: 'Los Ríos',
    numero: 'XIV',
    comunas: [
      'Corral',
      'Futrono',
      'La Unión',
      'Lago Ranco',
      'Lanco',
      'Los Lagos',
      'Mariquina',
      'Máfil',
      'Paillaco',
      'Panguipulli',
      'Río Bueno',
      'Valdivia',
    ],
  },
  {
    region: 'Los Lagos',
    numero: 'X',
    comunas: [
      'Ancud',
      'Calbuco',
      'Castro',
      'Chaitén',
      'Chonchi',
      'Cochamó',
      'Curaco de Vélez',
      'Dalcahue',
      'Fresia',
      'Frutillar',
      'Futaleufú',
      'Hualaihué',
      'Llanquihue',
      'Los Muermos',
      'Maullín',
      'Osorno',
      'Palena',
      'Puerto Montt',
      'Puerto Octay',
      'Puerto Varas',
      'Puqueldón',
      'Purranque',
      'Puyehue',
      'Queilén',
      'Quellón',
      'Quemchi',
      'Quinchao',
      'Río Negro',
      'San Juan de la Costa',
      'San Pablo',
    ],
  },
  {
    region: 'Aisén del Gral. Carlos Ibáñez del Campo',
    numero: 'XI',
    comunas: [
      'Aisén',
      'Chile Chico',
      'Cisnes',
      'Cochrane',
      'Coihaique',
      'Guaitecas',
      'Lago Verde',
      'O’Higgins',
      'Río Ibáñez',
      'Tortel',
    ],
  },
  {
    region: 'Magallanes y de la Antártica Chilena',
    numero: 'XII',
    comunas: [
      'Antártica',
      'Cabo de Hornos (Ex Navarino)',
      'Laguna Blanca',
      'Natales',
      'Porvenir',
      'Primavera',
      'Punta Arenas',
      'Río Verde',
      'San Gregorio',
      'Timaukel',
      'Torres del Paine',
    ],
  },
];

export const carrerasUtalca = [
  {
    codigo: 'I78S1C11J1V1',
    nombre: 'ODONTOLOGIA',
  },
  {
    codigo: 'I78S1C12J1V1',
    nombre: 'TECNOLOGIA MEDICA',
  },
  {
    codigo: 'I78S1C14J1V1',
    nombre: 'PSICOLOGIA',
  },
  {
    codigo: 'I78S1C15J1V1',
    nombre: 'KINESIOLOGIA',
  },
  {
    codigo: 'I78S1C16J1V1',
    nombre: 'FONOAUDIOLOGIA',
  },
  {
    codigo: 'I78S1C1J1V1',
    nombre: 'AGRONOMIA',
  },
  {
    codigo: 'I78S1C237J1V1',
    nombre: 'ENFERMERIA',
  },
  {
    codigo: 'I78S1C239J1V1',
    nombre: 'NUTRICION Y DIETETICA',
  },
  {
    codigo: 'I78S1C242J1V1',
    nombre: 'AUDITORIA E INGENIERIA EN CONTROL DE GESTION',
  },
  {
    codigo: 'I78S1C243J1V1',
    nombre: 'ADMINISTRACION PUBLICA',
  },
  {
    codigo: 'I78S1C294J1V1',
    nombre: 'INGENIERIA CIVIL EN BIOINFORMATICA',
  },
  {
    codigo: 'I78S1C298J1V1',
    nombre: 'INGENIERIA EN DESARROLLO DE VIDEOJUEGOS Y REALIDAD VIRTUAL',
  },
  {
    codigo: 'I78S1C2J1V1',
    nombre: 'ARQUITECTURA',
  },
  {
    codigo: 'I78S1C332J1V1',
    nombre: 'BIOQUIMICA',
  },
  {
    codigo: 'I78S1C337J1V1',
    nombre: 'LICENCIATURA EN INTERPRETACION Y FORMACION MUSICAL ESPECIALIZADA',
  },
  {
    codigo: 'I78S1C338J1V1',
    nombre: 'OBSTETRICIA Y PUERICULTURA',
  },
  {
    codigo: 'I78S1C35J1V1',
    nombre: 'DISE\u00d1O',
  },
  {
    codigo: 'I78S1C369J1V1',
    nombre: 'TERAPIA OCUPACIONAL',
  },
  {
    codigo: 'I78S1C3J1V1',
    nombre: 'CONTADOR PUBLICO Y AUDITOR',
  },
  {
    codigo: 'I78S1C42J1V1',
    nombre: 'INGENIERIA EN INFORMATICA EMPRESARIAL',
  },
  {
    codigo: 'I78S1C43J1V1',
    nombre: 'INGENIERIA COMERCIAL',
  },
  {
    codigo: 'I78S1C48J1V1',
    nombre: 'MEDICINA',
  },
  {
    codigo: 'I78S1C4J1V1',
    nombre: 'DERECHO',
  },
  {
    codigo: 'I78S3C249J1V2',
    nombre: 'INGENIERIA CIVIL DE MINAS',
  },
  {
    codigo: 'I78S3C293J1V1',
    nombre: 'INGENIERIA CIVIL ELECTRICA',
  },
  {
    codigo: 'I78S3C295J1V1',
    nombre: 'INGENIERIA CIVIL EN OBRAS CIVILES',
  },
  {
    codigo: 'I78S3C296J1V1',
    nombre: 'INGENIERIA CIVIL MECANICA',
  },
  {
    codigo: 'I78S3C297J1V1',
    nombre: 'INGENIERIA CIVIL MECATRONICA',
  },
  {
    codigo: 'I78S3C378J3V1',
    nombre: 'INGENIERIA CIVIL INDUSTRIAL MENCION GESTION INDUSTRIAL',
  },
  {
    codigo: 'I78S3C6J1V2',
    nombre: 'INGENIERIA CIVIL EN COMPUTACION',
  },
  {
    codigo: 'I78S3C7J1V2',
    nombre: 'INGENIERIA CIVIL INDUSTRIAL',
  },
  {
    codigo: 'I78S5C305J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION GENERAL BASICA CON MENCION EN ALEMAN',
  },
  {
    codigo: 'I78S5C306J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION MEDIA EN ALEMAN',
  },
  {
    codigo: 'I78S5C307J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION PARVULARIA CON MENCION EN ALEMAN',
  },
  {
    codigo: 'I78S5C341J3V2',
    nombre: 'PROGRAMA DE FORMACION PEDAGOGICA EN EDUCACION MEDIA EN ALEMAN',
  },
  {
    codigo: 'I78S5C4J1V1',
    nombre: 'DERECHO',
  },
  {
    codigo: 'I78S7C104J1V2',
    nombre: 'TECNICO SUPERIOR EN VINIFICACION Y ENOLOGIA',
  },
  {
    codigo: 'I78S7C131J1V2',
    nombre: 'TECNICO SUPERIOR EN VITICULTURA',
  },
  {
    codigo: 'I78S7C132J1V1',
    nombre: 'TECNICO SUPERIOR EN TURISMO ENOLOGICO',
  },
  {
    codigo: 'I78S7C133J1V1',
    nombre: 'TECNICO SUPERIOR EN ADMINISTRACION',
  },
  {
    codigo: 'I78S7C133J2V1',
    nombre: 'TECNICO SUPERIOR EN ADMINISTRACION',
  },
  {
    codigo: 'I78S8C286J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION MEDIA EN INGLES',
  },
  {
    codigo: 'I78S8C328J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION PARVULARIA MENCION EN INGLES',
  },
  {
    codigo: 'I78S8C329J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION GENERAL BASICA MENCION INGLES',
  },
  {
    codigo: 'I78S8C339J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION MEDIA EN BIOLOGIA Y QUIMICA',
  },
  {
    codigo: 'I78S8C340J1V1',
    nombre: 'PEDAGOGIA EN EDUCACION MEDIA EN MATEMATICA Y FISICA',
  },
  {
    codigo: 'I78S8C429J3V1',
    nombre:
      'PROGRAMA DE FORMACION PEDAGOGICA PARA PROFESIONALES Y/O LICENCIADOS(AS)',
  },
  {
    codigo: 'OTRA',
    nombre: 'OTRA CARRERA NO MENCIONADA',
  },
];
