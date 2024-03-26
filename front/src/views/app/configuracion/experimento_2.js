/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardFooter,
  Input,
  FormGroup,
  Label,
  CustomInput,
  FormText,
  CardText,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Formik, Form, Field } from 'formik';
import { wsAPI2 } from 'constants/defaultValues';
import { FormikReactSelect, FormikCheckbox } from './FormikFields';
import CardUser from './cardUser';

const Experimento2 = ({ match }) => {
  const [ws, setWs] = useState(null);
  const [socketOpen, setSocketOpen] = useState(false);

  const [modalAddTratamiento, setModalAddTratamiento] = useState(false);
  const [
    modalConfirmacionSiguienteActividad,
    setMmdalConfirmacionSiguienteActividad,
  ] = useState(false);
  const tratamientosOptions = [
    { label: 'Trat. 1', value: 'T1', key: 1 },
    { label: 'Trat. 2', value: 'T2', key: 2 },
    { label: 'Trat. 3', value: 'T3', key: 3 },
  ];
  const cantidadRondasOptions = [
    { label: '1', value: 1, key: 1 },
    { label: '2', value: 2, key: 2 },
    { label: '3', value: 3, key: 3 },
    { label: '4', value: 4, key: 4 },
    { label: '5', value: 5, key: 5 },
    { label: '6', value: 6, key: 6 },
    { label: '7', value: 7, key: 7 },
    { label: '8', value: 8, key: 8 },
    { label: '9', value: 9, key: 9 },
    { label: '10', value: 10, key: 10 },
    { label: '11', value: 11, key: 11 },
    { label: '12', value: 12, key: 12 },
  ];

  const [dataSesion, setDataSesion] = useState([]);
  const [dataUsuarios, setDataUsuarios] = useState([]);

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      ...values,
    };
    setTimeout(() => {
      console.log(payload);
    }, 500);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const websocket = new WebSocket(`${wsAPI2}1000`);
    websocket.onopen = () => {
      console.log('admin conectado');
      setSocketOpen(true);
      setWs(websocket);
    };
    websocket.onmessage = (e) => {
      const { data } = e;
      console.log(data);
      const json = JSON.parse(data);
      console.log(json);
      const users = json.usersOnline;
      if (users !== undefined) {
        const jsonUsers = JSON.parse(users);
        setDataUsuarios(jsonUsers);
      }
    };
    websocket.onclose = () => {
      console.log('coneccion cerrada del admin');
      setSocketOpen(false);
    };
    return () => {
      websocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const comenzarSiguienteActividad = () => {
    const jsonSend = {
      tipo: 'AUX_COMENZAR_SIGUIENTE_ACTIVIDAD',
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
    setMmdalConfirmacionSiguienteActividad(
      !modalConfirmacionSiguienteActividad
    );
  };

  const comenzarEncuesta = () => {
    const jsonSend = {
      tipo: 'AUX_COMENZAR_ENCUESTA',
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };

  return (
    <Card>
      <CardTitle>
        <IntlMessages id="experimento.grupo1" />
      </CardTitle>
      <CardBody>
        {socketOpen ? (
          <div className="scroll dashboard-list-with-thumbs">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              {' '}
              <Row>
                <Colxx lg="8">
                  <Card>
                    <CardBody>
                      <CardText>
                        {' '}
                        aaca debe estar la descripcion de los tratamientos
                      </CardText>
                    </CardBody>
                  </Card>
                </Colxx>
                <Colxx lg="4">
                  <CardUser idUser="A" dataUsuarios={dataUsuarios} />
                  <CardUser idUser="B" dataUsuarios={dataUsuarios} />
                  <CardUser idUser="C" dataUsuarios={dataUsuarios} />
                  <CardUser idUser="D" dataUsuarios={dataUsuarios} />
                  <CardUser idUser="E" dataUsuarios={dataUsuarios} />
                  <CardUser idUser="F" dataUsuarios={dataUsuarios} />
                </Colxx>
              </Row>
            </PerfectScrollbar>
          </div>
        ) : (
          <> Por favor recargar la pag F5</>
        )}
      </CardBody>
      <CardFooter>
        <Button
          onClick={() =>
            setMmdalConfirmacionSiguienteActividad(
              !modalConfirmacionSiguienteActividad
            )
          }
        >
          Siguiente actividad
        </Button>
        <Button onClick={comenzarEncuesta}>Comenzar encuesta</Button>
      </CardFooter>
      <Formik
        initialValues={{
          cantidadRondas: cantidadRondasOptions[0],
          tratamiento: tratamientosOptions[0],
          prueba: false,
        }}
        onSubmit={onSubmit}
      >
        {({
          // eslint-disable-next-line no-unused-vars
          handleSubmit,
          handleReset,
          // eslint-disable-next-line no-unused-vars
          setFieldValue,
          // eslint-disable-next-line no-unused-vars
          setFieldTouched,
          // eslint-disable-next-line no-unused-vars
          handleChange,
          // eslint-disable-next-line no-unused-vars
          handleBlur,
          // eslint-disable-next-line no-unused-vars
          values,
          errors,
          touched,
          // eslint-disable-next-line no-unused-vars
          isSubmitting,
        }) => (
          <>
            <Modal
              isOpen={modalAddTratamiento}
              toggle={() => setModalAddTratamiento(!modalAddTratamiento)}
            >
              <Form className="av-tooltip tooltip-label-bottom">
                <ModalHeader>Nuevo tratamiento</ModalHeader>
                <ModalBody>
                  <Row>
                    <Colxx xxs="12" xs="12" lg="8">
                      <FormGroup className="form-group has-float-label">
                        <Label>TRATAMIENTO</Label>
                        <FormikReactSelect
                          name="tratamiento"
                          id="tratamiento"
                          value={values.tratamiento}
                          options={tratamientosOptions}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                        />
                        {errors.posicionCarrusel && touched.posicionCarrusel ? (
                          <div className="invalid-feedback d-block">
                            {errors.posicionCarrusel}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Colxx>
                    <Colxx xxs="12" xs="12" lg="4">
                      <FormGroup className="form-group has-float-label">
                        <Label>RONDAS</Label>
                        <FormikReactSelect
                          name="cantidadRondas"
                          id="cantidadRondas"
                          value={values.cantidadRondas}
                          options={cantidadRondasOptions}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                        />
                        {errors.posicionCarrusel && touched.posicionCarrusel ? (
                          <div className="invalid-feedback d-block">
                            {errors.posicionCarrusel}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Colxx>
                    <Colxx xxs="12" xs="12" lg="12">
                      <FormGroup className="error-l-150">
                        <FormikCheckbox
                          id="prueba"
                          name="prueba"
                          value={values.prueba}
                          label="Tratamiento de prueba"
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                        />
                        {errors.checkboxSingle && touched.checkboxSingle ? (
                          <div className="invalid-feedback d-block">
                            {errors.checkboxSingle}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Colxx>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Agregar
                  </Button>{' '}
                  <Button
                    color="secondary"
                    outline
                    onClick={() => setModalAddTratamiento(!modalAddTratamiento)}
                  >
                    Cancelar
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
            <Modal
              isOpen={modalConfirmacionSiguienteActividad}
              toggle={() =>
                setMmdalConfirmacionSiguienteActividad(
                  !modalConfirmacionSiguienteActividad
                )
              }
            >
              <Form className="av-tooltip tooltip-label-bottom">
                <ModalHeader>
                  Seguro que quiere comenzar la nueva actividad ?
                </ModalHeader>

                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => comenzarSiguienteActividad()}
                  >
                    SI
                  </Button>{' '}
                  <Button
                    color="secondary"
                    outline
                    onClick={() =>
                      setMmdalConfirmacionSiguienteActividad(
                        !modalConfirmacionSiguienteActividad
                      )
                    }
                  >
                    Cancelar
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          </>
        )}
      </Formik>
    </Card>
  );
};
export default Experimento2;
