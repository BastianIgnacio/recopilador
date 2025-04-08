/* eslint-disable camelcase */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Row, Card, CardBody, FormGroup, Label, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { regionesChile, carrerasUtalca } from 'constants/defaultValues';
import * as Yup from 'yup';
import {
  FormikCustomRadioGroup,
  FormikRadioButtonGroup,
  FormikRadioButtonGroupReelevancia,
} from './FormikFields';

// eslint-disable-next-line camelcase
const Encuesta = ({ match, client_id, ws, entorno, grupo }) => {
  const [botonDisabled, setBotonDisabled] = useState(false);
  const [mostrarField, setMostrarField] = useState(false);
  const [mostrarFieldComuna, setMostrarFieldComuna] = useState(false);
  const [mostrarFieldOtraActividad, setMostrarFieldOtraActividad] =
    useState(false);
  const [club, setClub] = useState('AZUL');
  const [jugador, setJugador] = useState([]);
  const sizeEncuesta = '20px';

  const [pregunta9, setPregunta9] = useState(false);

  const [regiones, setRegiones] = useState(
    JSON.parse(JSON.stringify(regionesChile))
  );
  const [region, setRegion] = useState(regiones[0].region);
  const getComunas = (regionBuscar) => {
    const comunasReturn = regiones.find(
      (regionIterator) => regionIterator.region === regionBuscar
    );
    return JSON.parse(JSON.stringify(comunasReturn.comunas));
  };
  const [comunas, setComunas] = useState(
    JSON.parse(JSON.stringify(getComunas(region)))
  );

  useEffect(() => {
    // CHECKEAMOS SI LA VISTA DEBE ESTAR BLOQUEADA
    console.log(entorno);
    const vistasBloqueadas = entorno.vistas;
    const vistaBloqueada = vistasBloqueadas.find(
      (vistaElement) => vistaElement.client_id === client_id
    );
    setBotonDisabled(vistaBloqueada.bloqueado);

    // CHECKEAMOS EL CLUB AL QUE PERTENECE EL JUGADOR
    const jugadorClub = entorno.actividad.jugadores.find(
      (jugadorElement) => jugadorElement.client_id === client_id
    );
    setClub(jugadorClub.club);
    setJugador(jugadorClub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id, entorno]);

  const [textBoton, settextBoton] = useState('Enviar Encuesta');

  const enviarEncuesta = (data) => {
    const jsonSend = {
      tipo: 'AUX_ENVIAR_ENCUESTA',
      data,
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };

  const onSubmit = (values, { setSubmitting }) => {
    setBotonDisabled(true);
    settextBoton('Encuesta enviada, muchas gracias!');

    /*
    let comunaOtra = '.';
    // VAMOS A GUARDAR LA COMUNA Y SI HAY OTRA COMUNA
    const comuna = values.selectComuna;
    if (comuna !== 'OTRA') {
      comunaOtra = '.';
    } else {
      comunaOtra = values.fieldComunaOtra;
    }

    // En relación a las actividades laborales vinculadas al mar, ¿podría indicarme las 3 actividades, en orden de importancia, a las cuáles usted le dedica más tiempo?
    const arrayActividades = values.actividadesLaboralesRadioGruop;
    // INCLUYE LA RAZON OTRA
    let actividadOtra = '';
    if (arrayActividades.includes(0)) {
      actividadOtra = values.fieldActividadLaboralOtra;
    } else {
      actividadOtra = '.';
    }

    // AHORA VAMOS A CHECKEAR LAS TRES RAZONES
    let actividad1 = arrayActividades[0];
    if (actividad1 === undefined) {
      actividad1 = '.';
    }
    let actividad2 = arrayActividades[1];
    if (actividad2 === undefined) {
      actividad2 = '.';
    }
    let actividad3 = arrayActividades[2];
    if (actividad3 === undefined) {
      actividad3 = '.';
    }

    // PREGUNTA ¿Qué razones cree que pueden llevar a un pescador a no cumplir con las normas o a realizar pesca ilegal? (Seleccione hasta 3 opciones)
    const arrayRazones = values.razonesRadioGruop;
    // INCLUYE LA RAZON OTRA
    let razonOtra = '';
    if (arrayRazones.includes(0)) {
      razonOtra = values.fieldRazonOtra;
    } else {
      razonOtra = '.';
    }

    */
    console.log(values);
    const datosEncuesta = {
      grupo: values.grupo,
      integrante: values.integrante,
      genero: values.selectGenero,
      edad: values.selectEdad,
      carrera: values.selectCarrera,
      anoCursandoCarrera: values.selectAnoCursandoCarrera,
      region: values.selectRegion,
      comuna: values.selectComuna,
      anoEsperaTenerCumplidosRequisitos:
        values.selectAnoEsperaTenerCumplidosRequisitos,
      ingresoFamilia: values.radioButtonIngresoFamilia,
      integrantesDeSuHogar: values.selectIntegrantesDeSuHogar,
      perteneceAlgunaAsociacion: values.selectPerteneceAlgunaAsociacion,
      puedeExternoPostular: values.selectPuedeExternoPostular,
      esPosibleExpulsar: values.selectEsPosibleExpulsar,
      hanIngresadoNuevosIntegrantes: values.selectHanIngresadoNuevosIntegrantes,
      hanExpulsadoAlgunIntegrante: values.selectHanExpulsadoAlgunIntegrante,
      importanciaFormarGrupos: values.radioButtonImportaciaFormarGrupos,
    };
    console.log(datosEncuesta);
    setTimeout(() => {
      enviarEncuesta(JSON.stringify(datosEncuesta, null, 2));
    }, 100);
  };

  const SignupSchema = Yup.object().shape({
    selectGenero: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectEdad: Yup.string().required('Debes seleccionar tu edad por favor!'),
    selectCarrera: Yup.string().required('Debes seleccionar por favor!'),
    selectAnoCursandoCarrera: Yup.string().required(
      'Debes seleccionar un año por favor!'
    ),
    selectRegion: Yup.string().required(
      'Debes seleccionar una región por favor!'
    ),
    selectComuna: Yup.string().required(
      'Debes seleccionar una comuna por favor!'
    ),
    selectAnoEsperaTenerCumplidosRequisitos: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    radioButtonIngresoFamilia: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectIntegrantesDeSuHogar: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectPerteneceAlgunaAsociacion: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectPuedeExternoPostular: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectEsPosibleExpulsar: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectHanIngresadoNuevosIntegrantes: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectHanExpulsadoAlgunIntegrante: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    radioButtonImportaciaFormarGrupos: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
  });

  const viviendoLugarOptions = (anos) => {
    const array = [];
    array.push({ value: 0, label: 'MENOS DE 1 AÑO' });
    array.push({ value: 1, label: '1 AÑO' });
    // eslint-disable-next-line no-plusplus
    for (let i = 2; i < anos; i++) {
      array.push({ value: i, label: `${i} AÑOS` });
    }

    return array;
  };
  const optionsNivelEstudios = [
    { value: 'BASICA', label: 'BASICA' },
    { value: 'MEDIA', label: 'MEDIA' },
    { value: 'SUPERIOR', label: 'SUPERIOR' },
  ];

  const generoOptions = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' },
    { value: 'PREFIERE_NO_RESPONDER', label: 'Prefiere no responder' },
  ];

  const estadoCivlesOptions = [
    { value: 'CASADO', label: 'CASADO' },
    { value: 'CONVIVIENTE', label: 'CONVIVIENTE' },
    { value: 'DIVORCIADO', label: 'DIVORCIADO' },
    { value: 'ANULADO', label: 'ANULADO' },
    { value: 'SEPARADO', label: 'SEPARADO' },
    { value: 'VIUDO', label: 'VIUDO' },
    { value: 'SOLTERO', label: 'SOLTERO' },
  ];

  const jefeHogarOptions = [
    { value: 'SI', label: 'SI' },
    { value: 'NO', label: 'NO' },
  ];

  const postuloOMiembro = [
    { value: 'POSTULO', label: 'POSTULÓ' },
    { value: 'MIEMBRO_FUNDADOR', label: 'MIEMBRO FUNDADOR' },
  ];

  const reelevanteOptions = (disabled) => {
    return [
      { value: '1', label: '1', disabled },
      { value: '2', label: '2', disabled },
      { value: '3', label: '3', disabled },
      { value: '4', label: '4', disabled },
      { value: '5', label: '5', disabled },
      { value: '6', label: '6', disabled },
      { value: '7', label: '7', disabled },
      { value: '8', label: '8', disabled },
      { value: '9', label: '9', disabled },
      { value: '10', label: '10', disabled },
    ];
  };

  const siNOOptions = (disabled) => {
    return [
      { value: 'SI', label: 'SI', disabled, boolean: true },
      { value: 'NO', label: 'NO', disabled, boolean: false },
    ];
  };

  const confiaOptions = (disabled) => {
    return [
      { value: 1, label: 'NADA', disabled },
      { value: 2, label: 'POCO', disabled },
      { value: 3, label: 'ALGO', disabled },
      { value: 4, label: 'BASTANTE', disabled },
      { value: 5, label: 'TOTALMENTE', disabled },
    ];
  };

  const creibleSistemaFiscalizacion = (disabled) => {
    return [
      { value: 1, label: 'NADA CREIBLE', disabled },
      { value: 2, label: 'POCO CREIBLE', disabled },
      { value: 3, label: 'MODERADAMENTE CREIBLE', disabled },
      { value: 4, label: 'MUY CREIBLE', disabled },
      { value: 5, label: 'TOTALMENTE CREIBLE', disabled },
    ];
  };

  const normasAceptables = (disabled) => {
    return [
      { value: 1, label: 'NADA ACEPTABLES', disabled },
      { value: 2, label: 'POCO ACEPTABLES', disabled },
      { value: 3, label: 'MODERADAMENTE ACEPTABLES', disabled },
      { value: 4, label: 'MUY ACEPTABLES', disabled },
      { value: 5, label: 'TOTALMENTE ACEPTABLES', disabled },
    ];
  };

  const impactoNormas = (disabled) => {
    return [
      { value: 1, label: 'MUY NEGATIVO', disabled },
      { value: 2, label: 'NEGATIVO', disabled },
      { value: 3, label: 'NI POSITIVO NI NEGATIVO', disabled },
      { value: 4, label: 'POSITIVO', disabled },
      { value: 5, label: 'MUY POSITIVO', disabled },
    ];
  };

  const probableSancion = (disabled) => {
    return [
      { value: 1, label: 'NADA PROBABLE', disabled },
      { value: 2, label: 'POCO PROBABLE', disabled },
      { value: 3, label: 'MODERADAMENTE PROBABLE', disabled },
      { value: 4, label: 'MUY PROBABLE', disabled },
      { value: 5, label: 'TOTALMENTE PROBABLE', disabled },
    ];
  };

  const anosCursandoOptions = (disabled) => {
    return [
      { value: 1, label: '1° Año', disabled },
      { value: 2, label: '2° Año', disabled },
      { value: 3, label: '3° Año', disabled },
      { value: 4, label: '4° Año', disabled },
      { value: 5, label: '5° Año', disabled },
      { value: 6, label: '6° Año', disabled },
      { value: 7, label: '7° Año', disabled },
      { value: -1, label: 'OTRO', disabled },
    ];
  };

  const anoEsperaTitularseOpctions = (disabled) => {
    return [
      { value: 2025, label: 'En 2025', disabled },
      { value: 2026, label: 'En 2026', disabled },
      { value: 2027, label: 'En 2027', disabled },
      { value: 2028, label: 'En 2028', disabled },
      { value: 2029, label: 'En 2029', disabled },
      { value: 2030, label: 'En 2030', disabled },
      { value: 2031, label: 'En 2031', disabled },
      { value: 2032, label: 'En 2032', disabled },
    ];
  };

  const integrantesHogarOptions = (disabled) => {
    return [
      { value: 1, label: '1 Integrante', disabled },
      { value: 2, label: '2 Integrantes', disabled },
      { value: 3, label: '3 Integrantes', disabled },
      { value: 4, label: '4 Integrantes', disabled },
      { value: 5, label: '5 Integrantes', disabled },
      { value: 6, label: '6 Integrantes', disabled },
      { value: 7, label: '7 Integrantes', disabled },
      { value: 8, label: '8 Integrantes', disabled },
      { value: 9, label: '9 Integrantes', disabled },
      { value: 10, label: '10 Integrantes', disabled },
      { value: 11, label: '11 Integrantes', disabled },
      { value: 12, label: '12 Integrantes', disabled },
      { value: 13, label: '13 Integrantes', disabled },
      { value: 14, label: '14 Integrantes', disabled },
      { value: 15, label: '15 Integrantes', disabled },
      { value: 16, label: '16 Integrantes', disabled },
      { value: 99, label: 'Más de 16 Integrantes', disabled },
    ];
  };

  const puedeExternoPostularOptions = (disabled) => {
    return [
      {
        value: 'SI',
        label: 'Sí, es posible postular para ser miembro de la agrupación.',
        disabled,
      },
      {
        value: 'NO',
        label: 'No es posible postular para ser miembro de la agrupación.',
        disabled,
      },
    ];
  };

  const puedeExpulsarIntegrante = (disabled) => {
    return [
      {
        value: 'SI',
        label: 'Sí, es posible expulsar.',
        disabled,
      },
      {
        value: 'NO',
        label: 'No es posible expulsar.',
        disabled,
      },
    ];
  };

  const generarIngresoFamiliarOptions = (disabled) => {
    if (disabled) {
      return [
        { value: '1', label: 'De $0 a $300.000', disabled },
        { value: '2', label: 'De $300.001 a $600.000', disabled },
        { value: '3', label: 'De $600.001 a $900.000', disabled },
        { value: '4', label: 'De $900.001 a $1.200.000', disabled },
        { value: '5', label: 'De $1.200.001 a $1.500.000', disabled },
        { value: '6', label: 'De $1.500.001 a $1.900.000', disabled },
        { value: '7', label: 'De $1.900.001 a $2.400.000', disabled },
        { value: '8', label: 'De $2.400.001 a $3.000.000', disabled },
        { value: '9', label: 'De $3.000.001 a $3.600.000', disabled },
        { value: '10', label: 'De $3.600.001 o más', disabled },
      ];
    }
    return [
      { value: '1', label: 'De $0 a $300.000' },
      { value: '2', label: 'De $300.001 a $600.000' },
      { value: '3', label: 'De $600.001 a $900.000' },
      { value: '4', label: 'De $900.001 a $1.200.000' },
      { value: '5', label: 'De $1.200.001 a $1.500.000' },
      { value: '6', label: 'De $1.500.001 a $1.900.000' },
      { value: '7', label: 'De $1.900.001 a $2.400.000' },
      { value: '8', label: 'De $2.400.001 a $3.000.000' },
      { value: '9', label: 'De $3.000.001 a $3.600.000' },
      { value: '10', label: 'De $3.600.001 o más' },
    ];
  };

  const optionsRazones = () => {
    return [
      { value: 1, label: 'Necesidad económica', disabled: false },
      {
        value: 2,
        label:
          'Las normas no están claras (confusión sobre lo que se permite y lo que no). ',
        disabled: false,
      },
      {
        value: 3,
        label:
          'Las normas son injustas (ej., no benefician a todos por igual).',
        disabled: false,
      },
      { value: 4, label: 'No hay suficiente vigilancia', disabled: false },
      {
        value: 5,
        label: 'Las sanciones no se aplican como deberían',
        disabled: false,
      },
      {
        value: 6,
        label:
          'Otros pescadores también incumplen (si ellos no cumplen, ¿por qué yo sí?).',
        disabled: false,
      },
      {
        value: 7,
        label:
          'Las normas afectan a mi trabajo (ej., me hacen ganar menos dinero).',
        disabled: false,
      },
      {
        value: 8,
        label:
          'No veo beneficios por cumplir con las normas (no mejora mi situación).',
        disabled: false,
      },
      { value: 9, label: 'Presión de otros pescadores.', disabled: false },
      { value: 0, label: 'Otra.', disabled: false },
    ];
  };

  const optionsActividadesLaborales = () => {
    return [
      { value: 1, label: 'ARMADOR', opc: 'ARMADOR', disabled: false },
      { value: 2, label: 'PATRON', opc: 'PATRON', disabled: false },
      {
        value: 3,
        label: 'TRIPULANTE PESCADOR',
        opc: 'TRIPULANTE_PESCADOR',
        disabled: false,
      },
      { value: 4, label: 'BUZO', opc: 'BUZO', disabled: false },
      {
        value: 5,
        label: 'AUXILIAR DE BUZO',
        opc: 'AUXILIAR_DE_BUZO',
        disabled: false,
      },
      { value: 6, label: 'ALGUERO', opc: 'ALGUERO', disabled: false },
      { value: 7, label: 'MARISCADOR', opc: 'MARISCADOR', disabled: false },
      { value: 8, label: 'VIGILANTE', opc: 'VIGILANTE', disabled: false },
      {
        value: 9,
        label: 'LABORES DE ADMINISTRACION',
        opc: 'LABORES_DE_ADMINISTRACION',
        disabled: false,
      },
      { value: 0, label: 'OTRA', opc: 'OTRA', disabled: false },
    ];
  };

  const generarEdadOptions = (min, max) => {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = min; i < max; i++) {
      array.push({ value: i, label: `${i} Años` });
    }
    return array;
  };

  const generarPersonasDependenOptions = (min, max) => {
    const array = [
      { value: 0, label: `NINGUNA PERSONA` },
      { value: 1, label: `SOLO 1 PERSONA` },
    ];
    // eslint-disable-next-line no-plusplus
    for (let i = 2; i < max; i++) {
      array.push({ value: i, label: `${i} PERSONAS` });
    }
    return array;
  };

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx xl="10">
          <Card>
            <CardBody>
              <h6 className="mb-4 text-left font-weight-bold h1">Encuesta</h6>
              <Formik
                initialValues={{
                  grupo,
                  integrante: client_id,
                  selectGenero: '',
                  selectEdad: '',
                  selectCarrera: '',
                  selectAnoCursandoCarrera: '',
                  selectRegion: regiones[0].region,
                  selectComuna: regiones[0].comunas[0],
                  selectAnoEsperaTenerCumplidosRequisitos: '',
                  radioButtonIngresoFamilia: '',
                  selectIntegrantesDeSuHogar: '',
                  selectPerteneceAlgunaAsociacion: '',
                  selectPuedeExternoPostular: '',
                  selectEsPosibleExpulsar: '',
                  selectHanIngresadoNuevosIntegrantes: '',
                  selectHanExpulsadoAlgunIntegrante: '',
                  radioButtonImportaciaFormarGrupos: '',
                }}
                onSubmit={onSubmit}
                validationSchema={SignupSchema}
              >
                {({
                  handleSubmit,
                  setFieldValue,
                  setFieldTouched,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <Form className="av-tooltip">
                    {/** GENERO */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>1. Género</Label>
                      <Colxx lg={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectGenero"
                          className="form-control"
                          value={values.selectGenero}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generoOptions.map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectGenero && touched.selectGenero ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectGenero}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** EDAD */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        2. ¿Qué edad tiene ? (Años cumplidos)
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectEdad"
                          className="form-control"
                          value={values.selectEdad}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generarEdadOptions(16, 61).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectEdad && touched.selectEdad ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectEdad}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** CARRERA */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>3. ¿Qué carrera estudia ?</Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectCarrera"
                          className="form-control"
                          value={values.selectCarrera}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {carrerasUtalca.map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.selectCarrera && touched.selectCarrera ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectCarrera}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** AÑO CURSANDO */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        4. ¿Qué año esta actualemente cursando en su carrera ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectAnoCursandoCarrera"
                          className="form-control"
                          value={values.selectAnoCursandoCarrera}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {anosCursandoOptions(botonDisabled).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectAnoCursandoCarrera &&
                        touched.selectAnoCursandoCarrera ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectAnoCursandoCarrera}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** AÑO ESPERA TENER CUMPLIDO  */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        5. ¿En que año espera tener cumplido todos los
                        requisitos para titularse ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectAnoEsperaTenerCumplidosRequisitos"
                          className="form-control"
                          value={values.selectAnoEsperaTenerCumplidosRequisitos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {anoEsperaTitularseOpctions(botonDisabled).map(
                            (opc) => (
                              <option key={opc.value} value={opc.value}>
                                {opc.label}
                              </option>
                            )
                          )}
                        </select>
                        {errors.selectAnoEsperaTenerCumplidosRequisitos &&
                        touched.selectAnoEsperaTenerCumplidosRequisitos ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectAnoEsperaTenerCumplidosRequisitos}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** RESIDENCIA DE LA FAMILIA */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        6. ¿Cuál es su comuna de residencia (comuna de
                        residencia de la familia o aquella en que residía antes
                        de venir a la Universidad)?
                      </Label>
                      <Colxx sm={3}>
                        <select
                          disabled={botonDisabled}
                          name="selectRegion"
                          className="form-control"
                          value={values.selectRegion}
                          onChange={(event) => {
                            setFieldValue('selectRegion', event.target.value);
                            const comunasNuevaRegion = getComunas(
                              event.target.value
                            );
                            setComunas(comunasNuevaRegion);
                            setFieldValue(
                              'selectComuna',
                              comunasNuevaRegion[0]
                            );
                          }}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          {regiones.map((item, i) => {
                            return (
                              <option value={item.region} key={item.region}>
                                {item.region}
                              </option>
                            );
                          })}
                        </select>
                      </Colxx>
                      <Colxx sm={3}>
                        <select
                          disabled={botonDisabled}
                          name="selectComuna"
                          className="form-control"
                          value={values.selectComuna}
                          onChange={(event) => {
                            setFieldValue('selectComuna', event.target.value);
                          }}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          {comunas.map((item, i) => {
                            return (
                              <option value={item} key={item}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </Colxx>
                    </FormGroup>
                    {/** INGRESO FAMILIA */}
                    <FormGroup
                      row
                      className="m-3 tooltip-center-bottom "
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        7. Considere el ingreso percibido por todos en su hogar
                        durante el año pasado (2024). Sumando todos los ingresos
                        de las personas de su hogar, ¿Qué rango describe de
                        mejor forma el ingreso mensual de su hogar antes de
                        impuestos? Por favor incluya salarios, pensiones o
                        seguros sociales, ayuda a niños, subsidios, ingreso de
                        negocios o depósitos y cualquier otro ingreso.
                      </Label>
                      <Colxx sm={6}>
                        <FormikRadioButtonGroup
                          name="radioButtonIngresoFamilia"
                          id="radioButtonIngresoFamilia"
                          value={values.radioButtonIngresoFamilia}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          options={generarIngresoFamiliarOptions(botonDisabled)}
                          style={{ fontSize: sizeEncuesta }}
                        />
                        {errors.radioButtonIngresoFamilia &&
                        touched.radioButtonIngresoFamilia ? (
                          <div className="invalid-feedback d-block">
                            {errors.radioButtonIngresoFamilia}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** INTEGRANTES DEL HOGAR */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        8. Indique, por favor, el número de integrantes de su
                        hogar
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectIntegrantesDeSuHogar"
                          className="form-control"
                          value={values.selectIntegrantesDeSuHogar}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {integrantesHogarOptions(botonDisabled).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectIntegrantesDeSuHogar &&
                        touched.selectIntegrantesDeSuHogar ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectIntegrantesDeSuHogar}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {/** PERTENECE ALGUNA ASOCIACION */}
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        9. ¿Pertenece usted a alguna asociación, agrupación, o
                        club? (considere cualquier tipo de agrupación) (En caso
                        que su respuesta a la pregunta 9 sea “No”, pasar a la
                        pregunta 14)
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectPerteneceAlgunaAsociacion"
                          className="form-control"
                          value={values.selectPerteneceAlgunaAsociacion}
                          onChange={(event) => {
                            const valor = event.target.value;
                            setFieldValue(
                              'selectPerteneceAlgunaAsociacion',
                              valor
                            );
                            if (valor === 'SI') {
                              setPregunta9(true);
                            }
                            if (valor === 'NO') {
                              setPregunta9(false);
                              setFieldValue('selectPuedeExternoPostular', 'NO');
                              setFieldValue('selectEsPosibleExpulsar', 'NO');
                              setFieldValue(
                                'selectHanIngresadoNuevosIntegrantes',
                                'NO'
                              );
                              setFieldValue(
                                'selectHanExpulsadoAlgunIntegrante',
                                'NO'
                              );
                            }
                          }}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {siNOOptions(botonDisabled).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectPerteneceAlgunaAsociacion &&
                        touched.selectPerteneceAlgunaAsociacion ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectPerteneceAlgunaAsociacion}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    {pregunta9 && (
                      <>
                        {/** PUEDE EXTERNO POSTULAR */}
                        <FormGroup
                          row
                          className="m-3 tooltip-right-bottom"
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <Label sm={6}>
                            10. Considere la situación actual en la asociación,
                            agrupación, o club a la que usted pertenece. ¿Puede
                            una persona externa postular para ser miembro de la
                            agrupación?
                          </Label>
                          <Colxx sm={6}>
                            <select
                              disabled={botonDisabled}
                              name="selectPuedeExternoPostular"
                              className="form-control"
                              value={values.selectPuedeExternoPostular}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{ fontSize: sizeEncuesta }}
                            >
                              <option key="" value="" disabled>
                                Seleccione su respuesta!
                              </option>
                              {puedeExternoPostularOptions(botonDisabled).map(
                                (opc) => (
                                  <option key={opc.value} value={opc.value}>
                                    {opc.label}
                                  </option>
                                )
                              )}
                            </select>
                            {errors.selectPuedeExternoPostular &&
                            touched.selectPuedeExternoPostular ? (
                              <div className="invalid-feedback d-block">
                                {errors.selectPuedeExternoPostular}
                              </div>
                            ) : null}
                          </Colxx>
                        </FormGroup>
                        {/** ES POSIBLE EXPULSAR */}
                        <FormGroup
                          row
                          className="m-3 tooltip-right-bottom"
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <Label sm={6}>
                            11. Considere la situación actual en su asociación,
                            agrupación, o club.  ¿Es posible expulsar a un
                            integrante de la agrupación?
                          </Label>
                          <Colxx sm={6}>
                            <select
                              disabled={botonDisabled}
                              name="selectEsPosibleExpulsar"
                              className="form-control"
                              value={values.selectEsPosibleExpulsar}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{ fontSize: sizeEncuesta }}
                            >
                              <option key="" value="" disabled>
                                Seleccione su respuesta!
                              </option>
                              {puedeExpulsarIntegrante(botonDisabled).map(
                                (opc) => (
                                  <option key={opc.value} value={opc.value}>
                                    {opc.label}
                                  </option>
                                )
                              )}
                            </select>
                            {errors.selectEsPosibleExpulsar &&
                            touched.selectEsPosibleExpulsar ? (
                              <div className="invalid-feedback d-block">
                                {errors.selectEsPosibleExpulsar}
                              </div>
                            ) : null}
                          </Colxx>
                        </FormGroup>
                        {/** HAN INGRESADO NUEVOS INTEGRANTES EN LOS ULTIMOS 5 AÑOS */}
                        <FormGroup
                          row
                          className="m-3 tooltip-right-bottom"
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <Label sm={6}>
                            12. Considere los últimos 5 años de funcionamiento
                            de su asociación, agrupación, o club. ¿Han ingresado
                            nuevos integrantes en el periodo antes referido?
                          </Label>
                          <Colxx sm={6}>
                            <select
                              disabled={botonDisabled}
                              name="selectHanIngresadoNuevosIntegrantes"
                              className="form-control"
                              value={values.selectHanIngresadoNuevosIntegrantes}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{ fontSize: sizeEncuesta }}
                            >
                              <option key="" value="" disabled>
                                Seleccione su respuesta!
                              </option>
                              {siNOOptions(botonDisabled).map((opc) => (
                                <option key={opc.value} value={opc.value}>
                                  {opc.label}
                                </option>
                              ))}
                            </select>
                            {errors.selectHanIngresadoNuevosIntegrantes &&
                            touched.selectHanIngresadoNuevosIntegrantes ? (
                              <div className="invalid-feedback d-block">
                                {errors.selectHanIngresadoNuevosIntegrantes}
                              </div>
                            ) : null}
                          </Colxx>
                        </FormGroup>
                        {/** HAN EXPULSADO NUEVOS INTEGRANTES EN LOS ULTIMOS 5 AÑOS */}
                        <FormGroup
                          row
                          className="m-3 tooltip-right-bottom"
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <Label sm={6}>
                            13. Considere los últimos 5 años de funcionamiento
                            de su asociación, agrupación, o club. ¿Ha sido
                            expulsado algún integrante en el periodo antes
                            referido?
                          </Label>
                          <Colxx sm={6}>
                            <select
                              disabled={botonDisabled}
                              name="selectHanExpulsadoAlgunIntegrante"
                              className="form-control"
                              value={values.selectHanExpulsadoAlgunIntegrante}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{ fontSize: sizeEncuesta }}
                            >
                              <option key="" value="" disabled>
                                Seleccione su respuesta!
                              </option>
                              {siNOOptions(botonDisabled).map((opc) => (
                                <option key={opc.value} value={opc.value}>
                                  {opc.label}
                                </option>
                              ))}
                            </select>
                            {errors.selectHanExpulsadoAlgunIntegrante &&
                            touched.selectHanExpulsadoAlgunIntegrante ? (
                              <div className="invalid-feedback d-block">
                                {errors.selectHanExpulsadoAlgunIntegrante}
                              </div>
                            ) : null}
                          </Colxx>
                        </FormGroup>
                      </>
                    )}
                    {/** IMPORTANCIA DE FORMAR GRUPOS */}
                    <FormGroup
                      row
                      className="m-3 tooltip-center-bottom "
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        14. En su opinión, ¿cuán importante es formar grupos o
                        asociaciones (de estudiantes, trabajo, amigos, etc) en
                        su vida cotidiana? Utilice una escala entre 1 y 10, 1
                        indica que formar grupos es irrelevante para sus
                        actividades cotidianas, y 10 indica que formar grupos es
                        muy importante para sus actividades cotidianas.
                      </Label>
                      <Colxx sm={6}>
                        <div className="d-flex justify-content-between">
                          <Label className="m-2">Irrelevante</Label>
                          <FormikRadioButtonGroupReelevancia
                            inline
                            name="radioButtonImportaciaFormarGrupos"
                            id="radioButtonImportaciaFormarGrupos"
                            value={values.radioButtonImportaciaFormarGrupos}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            options={reelevanteOptions(botonDisabled)}
                            style={{ fontSize: sizeEncuesta }}
                          />
                          <Label className="m-2">Muy importante</Label>
                        </div>
                        {errors.radioButtonImportaciaFormarGrupos &&
                        touched.radioButtonImportaciaFormarGrupos ? (
                          <div className="invalid-feedback d-block">
                            {errors.radioButtonImportaciaFormarGrupos}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={botonDisabled}
                        color="primary"
                        type="submit"
                        block
                        style={{ fontSize: sizeEncuesta }}
                        className="mt-4"
                      >
                        {textBoton}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default Encuesta;
