import { adminRoot } from './defaultValues';

const data = [
  {
    id: 'conf',
    icon: 'iconsminds-gear',
    label: 'menu.configuracion',
    to: `${adminRoot}/configuracion`,
    // roles: [UserRole.Admin, UserRole.Editor],
    subs: [
      {
        icon: 'simple-icon-plus',
        label: 'menu.grupo1',
        to: `${adminRoot}/configuracion/sesionGrupo1`,
      },
      {
        icon: 'simple-icon-plus',
        label: 'menu.grupo2',
        to: `${adminRoot}/configuracion/sesionGrupo2`,
      },
      {
        icon: 'simple-icon-list',
        label: 'menu.historial',
        to: `${adminRoot}/configuracion/historial`,
      },
    ],
  },
];
export default data;
