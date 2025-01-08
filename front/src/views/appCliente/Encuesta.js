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
import { comunas } from 'constants/defaultValues';
import * as Yup from 'yup';
import {
  FormikRadioButtonGroup,
  FormikRadioButtonGroupReelevancia,
  FormikCustomRadioGroupRazones,
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
    // setBotonDisabled(true);
    settextBoton('Encuesta enviada, muchas gracias!');
    console.log(values);

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

    // AHORA VAMOS A CHECKEAR LAS TRES RAZONES
    let razon1 = arrayRazones[0];
    if (razon1 === undefined) {
      razon1 = '.';
    }
    let razon2 = arrayRazones[1];
    if (razon2 === undefined) {
      razon2 = '.';
    }
    let razon3 = arrayRazones[2];
    if (razon3 === undefined) {
      razon3 = '.';
    }

    const datosEncuesta = {
      grupo: values.grupo,
      integrante: values.integrante,
      genero: values.selectGenero,
      edad: values.selectEdad,
      comuna: values.selectComuna,
      nivelEducacional: values.selectNivelEducacional,
      estadoCivil: values.selectEstadoCivil,
      jefeHogar: values.selectJefeHogar,
      personasDependen: values.selectPersonasDependen,
      actividadesLaboralesVinculadas: values.actividadesLaboralesRadioGruop,
      actividad1,
      actividad2,
      actividad3,
      actividadOtra,
      anosViviendoLugar: values.selectViviendoLugar,
      ingresoFamilia: values.selectIngresoFamilia,
      anosSiendoIntegranteSindicato: values.anosSiendoIntegranteSindicato,
      tipoIntegrante: values.selectIntegranteFundador,
      importanciaMiembroSindicato: values.radioButtonReelevanciaSindicato,
      puedeExternoPostularSindicato: values.selectPuedeExternoPostular,
      esPosibleExpulsarSindicato: values.selectPuedeSindicatoExpulsar,
      sindicatoHaIntegradoNuevosMiembros:
        values.selectSindicatoHaIntegradoNuevosMiembros,
      sindicatoHaExpulsadoNuevosMiembros:
        values.selectSindicatoHaExpulsadoNuevosMiembros,
      confiaOtrosPescadores: values.selectConfiaOtrosPescadores,
      creibleSistemaFiscalizacion: values.selectCreibleSistemaFiscalizacion,
      aceptableNormas: values.selectAceptableNormas,
      percibeImpactoNormas: values.selectPercibeImpactoNormas,
      probableSancion: values.selectProbableSancion,
      razonesPescaIlegal: values.razonesRadioGruop,
      razon1,
      razon2,
      razon3,
      razonOtra,
      comunaOtra,
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
    selectNivelEducacional: Yup.string().required(
      'Debes seleccionar por favor!'
    ),
    selectComuna: Yup.string().required(
      'Debes seleccionar una comuna por favor!'
    ),
    selectEstadoCivil: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectJefeHogar: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectPersonasDependen: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectViviendoLugar: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectIngresoFamilia: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    anosSiendoIntegranteSindicato: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectIntegranteFundador: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    radioButtonReelevanciaSindicato: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectPuedeExternoPostular: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectPuedeSindicatoExpulsar: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectSindicatoHaIntegradoNuevosMiembros: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectSindicatoHaExpulsadoNuevosMiembros: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectConfiaOtrosPescadores: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectCreibleSistemaFiscalizacion: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectAceptableNormas: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectPercibeImpactoNormas: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectProbableSancion: Yup.string().required(
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
      { value: 'SI', label: 'SI', disabled },
      { value: 'NO', label: 'NO', disabled },
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
                  selectNivelEducacional: '',
                  selectComuna: '',
                  selectEstadoCivil: '',
                  selectJefeHogar: '',
                  selectPersonasDependen: '',
                  selectViviendoLugar: '',
                  selectIngresoFamilia: '',
                  anosSiendoIntegranteSindicato: '',
                  selectIntegranteFundador: '',
                  radioButtonReelevanciaSindicato: '',
                  selectPuedeExternoPostular: '',
                  selectPuedeSindicatoExpulsar: '',
                  selectSindicatoHaIntegradoNuevosMiembros: '',
                  selectSindicatoHaExpulsadoNuevosMiembros: '',
                  selectConfiaOtrosPescadores: '',
                  selectCreibleSistemaFiscalizacion: '',
                  selectAceptableNormas: '',
                  selectPercibeImpactoNormas: '',
                  selectProbableSancion: '',
                  razonesRadioGruop: [],
                  fieldRazonOtra: '',
                  fieldComunaOtra: '',
                  actividadesLaboralesRadioGruop: [],
                  fieldActividadLaboralOtra: '',
                }}
                onSubmit={onSubmit}
                // validationSchema={SignupSchema}
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
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>Género</Label>
                      <Colxx lg={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectGenero"
                          className="form-control"
                          placeholder="Seleccione"
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
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>¿Qué edad tiene ? (Años cumplidos)</Label>
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
                          {generarEdadOptions(16, 81).map((opc) => (
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
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        ¿Cuál fue el último año de escolaridad formal que usted
                        aprobó?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectNivelEducacional"
                          className="form-control"
                          value={values.selectNivelEducacional}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {optionsNivelEstudios.map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectNivelEducacional &&
                        touched.selectNivelEducacional ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectNivelEducacional}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>¿Cúal es su comuna de residencia?</Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectComuna"
                          className="form-control"
                          value={values.selectComuna}
                          onChange={(opc) => {
                            const opcNueva = opc.target.value;

                            if (opcNueva === 'OTRA') {
                              setMostrarFieldComuna(true);
                            } else {
                              setMostrarFieldComuna(false);
                            }
                            setFieldValue('selectComuna', opcNueva);
                            console.log(opc.target.value);
                          }}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {comunas.map((item, i) => {
                            return (
                              <option value={item.value} key={item.key}>
                                {item.value}
                              </option>
                            );
                          })}
                        </select>
                        {mostrarFieldComuna && (
                          <Field
                            className="form-control mt-2"
                            placeholder="INGRESE SU COMUNA"
                            name="fieldComunaOtra"
                          />
                        )}
                        {errors.selectComuna && touched.selectComuna ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectComuna}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        Estado Civil
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectEstadoCivil"
                          className="form-control"
                          value={values.selectEstadoCivil}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {estadoCivlesOptions.map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.value}
                            </option>
                          ))}
                        </select>
                        {errors.selectEstadoCivil &&
                        touched.selectEstadoCivil ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectEstadoCivil}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        Jefe de hogar
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectJefeHogar"
                          className="form-control"
                          value={values.selectJefeHogar}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {jefeHogarOptions.map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.value}
                            </option>
                          ))}
                        </select>
                        {errors.selectJefeHogar && touched.selectJefeHogar ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectJefeHogar}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        ¿Cúantas personas que viven con usted dependen
                        económicamente de los ingresos que usted aporta al hogar
                        ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectPersonasDependen"
                          className="form-control"
                          value={values.selectPersonasDependen}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generarPersonasDependenOptions(1, 16).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectPersonasDependen &&
                        touched.selectPersonasDependen ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectPersonasDependen}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  mt-4 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label className="d-block" sm={6}>
                        En relación a las actividades laborales vinculadas al
                        mar, ¿podría indicarme las 3 actividades, en orden de
                        importancia, a las cuáles usted le dedica más tiempo?
                      </Label>
                      <Colxx sm={6}>
                        <FormikCustomRadioGroupRazones
                          name="actividadesLaboralesRadioGruop"
                          id="actividadesLaboralesRadioGruop"
                          values={values.actividadesLaboralesRadioGruop}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          options={optionsActividadesLaborales()}
                          max={3}
                          setMostrarField={setMostrarFieldOtraActividad}
                        />
                        {mostrarFieldOtraActividad && (
                          <Field
                            className="form-control"
                            name="fieldActividadLaboralOtra"
                          />
                        )}
                        {errors.actividadesLaboralesRadioGruop &&
                        touched.actividadesLaboralesRadioGruop ? (
                          <div className="invalid-feedback d-block">
                            {errors.actividadesLaboralesRadioGruop}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>

                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        ¿Cúantos años lleva usted viviendo en este lugar ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectViviendoLugar"
                          className="form-control"
                          value={values.selectViviendoLugar}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {viviendoLugarOptions(30).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectViviendoLugar &&
                        touched.selectViviendoLugar ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectViviendoLugar}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-right-top"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        Considere el ingreso percibido por todos en su hogar
                        durante el año pasado (2024). Sumando todos los ingresos
                        de las personas de su hogar, ¿Qué rango describe de
                        mejor forma el ingreso mensual de su hogar antes de
                        impuestos? Por favor incluya salarios, pensiones o
                        seguros sociales, ayuda a niños, subsidios, ingreso de
                        negocios o depósitos y cualquier otro ingreso.
                      </Label>
                      <Colxx sm={6}>
                        <FormikRadioButtonGroup
                          name="selectIngresoFamilia"
                          id="selectIngresoFamilia"
                          value={values.selectIngresoFamilia}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          options={generarIngresoFamiliarOptions(botonDisabled)}
                          style={{ fontSize: sizeEncuesta }}
                        />
                        {errors.selectIngresoFamilia &&
                        touched.selectIngresoFamilia ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectIngresoFamilia}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        ¿Cúantos años lleva usted como integrante del sindicato
                        ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="anosSiendoIntegranteSindicato"
                          className="form-control"
                          value={values.anosSiendoIntegranteSindicato}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {viviendoLugarOptions(30).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.anosSiendoIntegranteSindicato &&
                        touched.anosSiendoIntegranteSindicato ? (
                          <div className="invalid-feedback d-block">
                            {errors.anosSiendoIntegranteSindicato}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        ¿Usted es un integrante fundador del sindicato o postuló
                        para ingresar después de su creación ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectIntegranteFundador"
                          className="form-control"
                          value={values.selectIntegranteFundador}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {postuloOMiembro.map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectIntegranteFundador &&
                        touched.selectIntegranteFundador ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectIntegranteFundador}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-center-bottom "
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label sm={6}>
                        En su opinión, ¿cuán importante es ser miembro del
                        sindicato para el desarrollo de sus actividades ?
                        Utilice una escala entre 1 y 10, 1 indica que ser
                        integrante del sindicato es irrelevante para sus
                        actividades, y 10 indica que ser parte del sindicato es
                        muy importante para sus actividades.
                      </Label>
                      <Colxx sm={6}>
                        <div className="d-flex justify-content-between">
                          <Label className="m-2">Irrelevante</Label>
                          <FormikRadioButtonGroupReelevancia
                            inline
                            name="radioButtonReelevanciaSindicato"
                            id="radioButtonReelevanciaSindicato"
                            value={values.radioButtonReelevanciaSindicato}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            options={reelevanteOptions(botonDisabled)}
                            style={{ fontSize: sizeEncuesta }}
                          />
                          <Label className="m-2">Muy importante</Label>
                        </div>
                        {errors.radioButtonReelevanciaSindicato &&
                        touched.radioButtonReelevanciaSindicato ? (
                          <div className="invalid-feedback d-block">
                            {errors.radioButtonReelevanciaSindicato}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        Considere la situacion actual en su sindicato, ¿Puede
                        una persona externa postular para ser miembro de la
                        organización ?
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
                          {siNOOptions(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.value}
                            </option>
                          ))}
                        </select>
                        {errors.selectPuedeExternoPostular &&
                        touched.selectPuedeExternoPostular ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectPuedeExternoPostular}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        Considere la situación actual en su sindicato, ¿Es
                        posible expulsar a un integrante del sindicato?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectPuedeSindicatoExpulsar"
                          className="form-control"
                          value={values.selectPuedeSindicatoExpulsar}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {siNOOptions(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.value}
                            </option>
                          ))}
                        </select>
                        {errors.selectPuedeSindicatoExpulsar &&
                        touched.selectPuedeSindicatoExpulsar ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectPuedeSindicatoExpulsar}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        Considere los últimos 5 años de funcionamiento del
                        sindicato. ¿Han ingresado nuevos integrantes al
                        sindicato en el periodo antes referido ?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectSindicatoHaIntegradoNuevosMiembros"
                          className="form-control"
                          value={
                            values.selectSindicatoHaIntegradoNuevosMiembros
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {siNOOptions(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.value}
                            </option>
                          ))}
                        </select>
                        {errors.selectSindicatoHaIntegradoNuevosMiembros &&
                        touched.selectSindicatoHaIntegradoNuevosMiembros ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectSindicatoHaIntegradoNuevosMiembros}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        Considere los últimos 5 años de funcionamiento del
                        sindicato. ¿Ha sido expulsado algún integrante en el
                        período antes referido?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectSindicatoHaExpulsadoNuevosMiembros"
                          className="form-control"
                          value={
                            values.selectSindicatoHaExpulsadoNuevosMiembros
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {siNOOptions(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.codigo}>
                              {opc.value}
                            </option>
                          ))}
                        </select>
                        {errors.selectSindicatoHaExpulsadoNuevosMiembros &&
                        touched.selectSindicatoHaExpulsadoNuevosMiembros ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectSindicatoHaExpulsadoNuevosMiembros}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        ¿Confía en que otros pescadores respetan las cuotas,
                        áreas de manejo o vedas establecidas?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectConfiaOtrosPescadores"
                          className="form-control"
                          value={values.selectConfiaOtrosPescadores}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {confiaOptions(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectConfiaOtrosPescadores &&
                        touched.selectConfiaOtrosPescadores ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectConfiaOtrosPescadores}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        ¿Qué tan creíble considera que es el sistema de
                        fiscalización y sanciones para garantizar el
                        cumplimiento de las normas pesqueras en su área de
                        manejo y/o zona de pesca?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectCreibleSistemaFiscalizacion"
                          className="form-control"
                          value={values.selectCreibleSistemaFiscalizacion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {creibleSistemaFiscalizacion(botonDisabled).map(
                            (opc) => (
                              <option key={opc.codigo} value={opc.value}>
                                {opc.label}
                              </option>
                            )
                          )}
                        </select>
                        {errors.selectCreibleSistemaFiscalizacion &&
                        touched.selectCreibleSistemaFiscalizacion ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectCreibleSistemaFiscalizacion}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        ¿Qué tan aceptables cree que son las normas que regulan
                        el acceso, las cuotas y las vedas en su actividad
                        pesquera?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectAceptableNormas"
                          className="form-control"
                          value={values.selectAceptableNormas}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {normasAceptables(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectAceptableNormas &&
                        touched.selectAceptableNormas ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectAceptableNormas}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        ¿Cómo percibe el impacto de las normas que regulan el
                        acceso, las cuotas y las vedas en su actividad pesquera
                        y la conservación de los recursos?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectPercibeImpactoNormas"
                          className="form-control"
                          value={values.selectPercibeImpactoNormas}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {impactoNormas(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectPercibeImpactoNormas &&
                        touched.selectPercibeImpactoNormas ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectPercibeImpactoNormas}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label for="emailHorizontal" sm={6}>
                        ¿Qué tan probable cree que sea sancionado si incumple
                        con las normas de pesca?
                      </Label>
                      <Colxx sm={6}>
                        <select
                          disabled={botonDisabled}
                          name="selectProbableSancion"
                          className="form-control"
                          value={values.selectProbableSancion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ fontSize: sizeEncuesta }}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {probableSancion(botonDisabled).map((opc) => (
                            <option key={opc.codigo} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectProbableSancion &&
                        touched.selectProbableSancion ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectProbableSancion}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3  mt-4 tooltip-right-bottom"
                      style={{ fontSize: sizeEncuesta }}
                    >
                      <Label className="d-block" sm={6}>
                        ¿Qué razones cree que pueden llevar a un pescador a no
                        cumplir con las normas o a realizar pesca ilegal?
                        (Seleccione hasta 3 opciones)
                      </Label>
                      <Colxx sm={6}>
                        <FormikCustomRadioGroupRazones
                          name="razonesRadioGruop"
                          id="razonesRadioGruop"
                          values={values.razonesRadioGruop}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          options={optionsRazones()}
                          max={3}
                          setMostrarField={setMostrarField}
                        />
                        {mostrarField && (
                          <Field
                            className="form-control"
                            name="fieldRazonOtra"
                          />
                        )}
                        {errors.razonesRadioGruop &&
                        touched.razonesRadioGruop ? (
                          <div className="invalid-feedback d-block">
                            {errors.razonesRadioGruop}
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
