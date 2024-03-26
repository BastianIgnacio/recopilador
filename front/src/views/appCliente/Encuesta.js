/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Row, Card, CardBody, FormGroup, Label, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { regionesChile, carrerasUtalca } from 'constants/defaultValues';
import * as Yup from 'yup';
import { FormikRadioButtonGroup } from './FormikFields';

const Encuesta = ({ match, id, grupo, ws, bloqueado }) => {
  const [botonDisabled, setBotonDisabled] = useState(bloqueado);

  const [textBoton, settextBoton] = useState('Enviar Encuesta');

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
    const payload = {
      ...values,
    };
    console.log(payload);
    setTimeout(() => {
      enviarEncuesta(JSON.stringify(payload, null, 2));
      console.log(payload);
    }, 500);
  };

  const SignupSchema = Yup.object().shape({
    selectGenero: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectEdad: Yup.string().required('Debes seleccionar tu edad por favor!'),
    selectUniversidad: Yup.string().required(
      'Debes seleccionar una Universidad por favor!'
    ),
    selectCarrera: Yup.string().required(
      'Debes seleccionar una Carrera por favor!'
    ),
    selectCursando: Yup.string().required(
      'Debes seleccionar el año que estas cursando por favor!'
    ),
    selectEsperaTenerCumplidos: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    selectRegion: Yup.string().required(
      'Debes seleccionar una Región por favor!'
    ),
    ingresoFamilia: Yup.string().required(
      'Debes seleccionar el ingreso de tu grupo familiar por favor!'
    ),
    selectIntegrantesFamilia: Yup.string().required(
      'Debes seleccionar cuantos integrantes por favor!'
    ),
    perteneAClub: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    reelevanteClub: Yup.string().required(
      'Debes seleccionar una respuesta por favor!'
    ),
    // radioGroup: Yup.string().required('A radio option is required'),
  });

  const optionsUniversidad = [
    { value: 'UNIVERSIDAD_TALCA', label: 'Universidad de Talca' },
    { value: 'OTRA', label: 'Otra Universidad' },
  ];

  const generoOptions = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' },
    { value: 'PREFIERE_NO_RESPONDER', label: 'Prefiere no responder' },
  ];

  const reelevanteOptions = (disabled) => {
    return [
      { value: '1', label: '-', disabled },
      { value: '2', label: '-', disabled },
      { value: '3', label: '-', disabled },
      { value: '4', label: '-', disabled },
      { value: '5', label: '-', disabled },
      { value: '6', label: '-', disabled },
      { value: '7', label: '-', disabled },
      { value: '8', label: '-', disabled },
      { value: '9', label: '-', disabled },
      { value: '10', label: '', disabled },
    ];
  };

  const perteneAClubOpctions = (disabled) => {
    return [
      { value: 'SI', label: 'Si', disabled },
      { value: 'NO', label: 'No', disabled },
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

  const generarEdadOptions = (min, max) => {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = min; i < max; i++) {
      array.push({ value: i, label: `${i} Años` });
    }
    return array;
  };

  const generarIntegrantesOptions = (min, max) => {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = min; i < max; i++) {
      array.push({ value: i, label: `${i} Integrante /s` });
    }
    return array;
  };

  const generarCursandoOptions = (min, max) => {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = min; i < max; i++) {
      array.push({ value: i, label: `${i}° Año` });
    }
    return array;
  };

  const generarEsperaTenerCumplidosOptions = (min, max) => {
    const array = [];
    // eslint-disable-next-line no-plusplus
    for (let i = min; i < max; i++) {
      array.push({ value: i, label: `En el Año ${i}` });
    }
    array.push({ value: 'OTRO', label: `En otro año` });
    return array;
  };

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx xl="8">
          <Card>
            <CardBody>
              <h6 className="mb-4 text-center font-weight-bold">Encuesta</h6>
              <Formik
                initialValues={{
                  grupo,
                  integrante: id,
                  selectGenero: '',
                  selectEdad: '',
                  selectUniversidad: '',
                  selectCarrera: '',
                  selectCursando: '',
                  selectEsperaTenerCumplidos: '',
                  ingresoFamilia: '',
                  selectIntegrantesFamilia: '',
                  perteneAClub: '',
                  reelevanteClub: '',
                  selectRegion: '',
                  selectComuna: '',
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
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={3}>Genero</Label>
                      <Colxx sm={9}>
                        <select
                          disabled={botonDisabled}
                          name="selectGenero"
                          className="form-control"
                          placeholder="Seleccione"
                          value={values.selectGenero}
                          onChange={handleChange}
                          onBlur={handleBlur}
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
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={3}>¿Que edad tiene ? (Años cumplidos)</Label>
                      <Colxx sm={9}>
                        <select
                          disabled={botonDisabled}
                          name="selectEdad"
                          className="form-control"
                          value={values.selectEdad}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generarEdadOptions(16, 66).map((opc) => (
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
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={3}>¿En que universidad estudias?</Label>
                      <Colxx sm={9}>
                        <select
                          disabled={botonDisabled}
                          name="selectUniversidad"
                          className="form-control"
                          value={values.selectUniversidad}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {optionsUniversidad.map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectUniversidad &&
                        touched.selectUniversidad ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectUniversidad}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup row className="m-3  tooltip-right-bottom">
                      <Label for="emailHorizontal" sm={3}>
                        ¿Que carrera estudias?
                      </Label>
                      <Colxx sm={9}>
                        <select
                          disabled={botonDisabled}
                          name="selectCarrera"
                          className="form-control"
                          value={values.selectCarrera}
                          onChange={handleChange}
                          onBlur={handleBlur}
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
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={4}>
                        ¿Que año está actualmente cursando en su carrera?
                      </Label>
                      <Colxx sm={8}>
                        <select
                          disabled={botonDisabled}
                          name="selectCursando"
                          className="form-control"
                          value={values.selectCursando}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generarCursandoOptions(1, 9).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectCursando && touched.selectCursando ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectCursando}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={4}>
                        ¿En que año espera tener cumplidos todos los requisitos
                        para titularse?
                      </Label>
                      <Colxx sm={8}>
                        <select
                          disabled={botonDisabled}
                          name="selectEsperaTenerCumplidos"
                          className="form-control"
                          value={values.selectEsperaTenerCumplidos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generarEsperaTenerCumplidosOptions(2024, 2031).map(
                            (opc) => (
                              <option key={opc.value} value={opc.value}>
                                {opc.label}
                              </option>
                            )
                          )}
                        </select>
                        {errors.selectEsperaTenerCumplidos &&
                        touched.selectEsperaTenerCumplidos ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectEsperaTenerCumplidos}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={4}>
                        ¿Cuál es su comuna de residencia o aquella en que
                        residía antes de venir a la Universidad?
                      </Label>
                      <Colxx sm={4}>
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
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {regiones.map((item, i) => {
                            return (
                              <option value={item.region} key={item.region}>
                                {item.region}
                              </option>
                            );
                          })}
                        </select>
                        {errors.selectRegion && touched.selectRegion ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectRegion}
                          </div>
                        ) : null}
                      </Colxx>
                      <Colxx sm={4}>
                        <select
                          disabled={botonDisabled}
                          name="selectComuna"
                          className="form-control"
                          value={values.selectComuna}
                          onChange={(event) => {
                            setFieldValue('selectComuna', event.target.value);
                          }}
                          onBlur={handleBlur}
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
                    <FormGroup row className="m-3 tooltip-right-top">
                      <Label sm={6}>
                        Considere el ingreso percibido por todos en su hogar
                        durante el año pasado (2023). Sumando todos los ingresos
                        de las personas de su hogar, ¿Qué rango describe de
                        mejor forma el ingreso mensual de su hogar antes de
                        impuestos? Por favor incluya salarios, pensiones o
                        seguros sociales, ayuda a niños, subsidios, ingreso de
                        negocios o depósitos y cualquier otro ingreso.
                      </Label>
                      <Colxx sm={6}>
                        <FormikRadioButtonGroup
                          name="ingresoFamilia"
                          id="ingresoFamilia"
                          value={values.ingresoFamilia}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          options={generarIngresoFamiliarOptions(botonDisabled)}
                        />
                        {errors.ingresoFamilia && touched.ingresoFamilia ? (
                          <div className="invalid-feedback d-block">
                            {errors.ingresoFamilia}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup row className="m-3 tooltip-right-bottom">
                      <Label sm={4}>
                        Indique, por favor, el número de integrantes de su hogar
                        (incluyendo a usted)
                      </Label>
                      <Colxx sm={8}>
                        <select
                          disabled={botonDisabled}
                          name="selectIntegrantesFamilia"
                          className="form-control"
                          value={values.selectIntegrantesFamilia}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option key="" value="" disabled>
                            Seleccione su respuesta!
                          </option>
                          {generarIntegrantesOptions(1, 20).map((opc) => (
                            <option key={opc.value} value={opc.value}>
                              {opc.label}
                            </option>
                          ))}
                        </select>
                        {errors.selectIntegrantesFamilia &&
                        touched.selectIntegrantesFamilia ? (
                          <div className="invalid-feedback d-block">
                            {errors.selectIntegrantesFamilia}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup
                      row
                      className="m-3 tooltip-label-right error-l-150"
                    >
                      <Label for="emailHorizontal" sm={4}>
                        Pertenece usted a alguna asociación, agrupación, o club?
                      </Label>
                      <Colxx sm={8}>
                        <FormikRadioButtonGroup
                          inline
                          name="perteneAClub"
                          id="perteneAClub"
                          value={values.perteneAClub}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          options={perteneAClubOpctions(botonDisabled)}
                        />
                        {errors.perteneAClub && touched.perteneAClub ? (
                          <div className="invalid-feedback d-block">
                            {errors.perteneAClub}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <FormGroup row className="m-3 tooltip-center-bottom ">
                      <Label sm={6}>
                        En su opinión, ¿cuán importante es formar grupos o
                        asociaciones (de trabajo, amigos, etc.) en su vida
                        diaria? Utilice escala entre 1 y 10; 1 indica que formar
                        grupos es irrelevante para sus actividades cotidianas, y
                        10 indica que formar grupos es muy importante para sus
                        actividades cotidianas.
                      </Label>
                      <Colxx sm={6}>
                        <div className="d-flex justify-content-center">
                          <Label className="m-2">Irrelevante</Label>
                          <FormikRadioButtonGroup
                            inline
                            name="reelevanteClub"
                            id="reelevanteClub"
                            value={values.reelevanteClub}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            options={reelevanteOptions(botonDisabled)}
                          />
                          <Label className="m-2">Muy relevante</Label>
                        </div>
                        {errors.reelevanteClub && touched.reelevanteClub ? (
                          <div className="invalid-feedback d-block">
                            {errors.reelevanteClub}
                          </div>
                        ) : null}
                      </Colxx>
                    </FormGroup>
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={botonDisabled}
                        color="primary"
                        type="submit"
                        style={{ minWidth: '200px' }}
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
