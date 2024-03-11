import { colorBlue, colorYellow } from 'constants/defaultValues';

const resultadosVotacion = [
  {
    id: 1,
    jugador: 'Jugador 1',
    resultado: 'AZUL',
    transicion: false,
    from: colorBlue,
    to: colorYellow,
  },
  {
    id: 2,
    jugador: 'Jugador 2',
    resultado: 'AMARILLO',
    transicion: false,
    from: colorBlue,
    to: colorYellow,
  },
  {
    id: 3,
    jugador: 'Jugador 3',
    resultado: 'AZUL',
    transicion: false,
    from: colorBlue,
    to: colorYellow,
  },
  {
    id: 4,
    jugador: '(TU) Jugador 4 ',
    resultado: 'AMARILLO',
    transicion: true,
    from: colorBlue,
    to: colorYellow,
  },
  {
    id: 5,
    jugador: 'Jugador 5',
    resultado: 'AZUL',
    transicion: false,
    from: colorBlue,
    to: colorYellow,
  },
  {
    id: 6,
    jugador: 'Jugador 6',
    resultado: 'AZUL',
    transicion: false,
    from: colorBlue,
    to: colorYellow,
  },
];

export default resultadosVotacion;
