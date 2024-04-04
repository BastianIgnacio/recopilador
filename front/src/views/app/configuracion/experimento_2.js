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
// eslint-disable-next-line import/no-unresolved
import { Colxx } from 'components/common/CustomBootstrap';
import { Formik, Form, Field } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { colorPlomo, wsAPI2 } from 'constants/defaultValues';
import { FormikReactSelect, FormikCheckbox } from './FormikFields';
import CardUser from './cardUser';
import CardTratamiento from './cardTratamiento';
import TablaJugadores from './TablaJugadores';

const Experimento2 = ({ match }) => {
  const [ws, setWs] = useState(null);
  const [socketOpen, setSocketOpen] = useState(false);
  const [modalCrearSesion, setModalCrearSesion] = useState(false);
  const [
    modalConfirmacionSiguienteActividad,
    setModalConfirmacionSiguienteActividad,
  ] = useState(false);
  const [modalConfirmacionEncuesta, setModalConfirmacionEncuesta] =
    useState(false);
  const tratamientosOptions = [
    { label: 'Trat. 1', value: 1 },
    { label: 'Trat. 2', value: 2 },
    { label: 'Trat. 3', value: 3 },
    { label: 'Trat. 4', value: 4 },
  ];

  const [dataSesion, setDataSesion] = useState([]);
  const [dataUsuarios, setDataUsuarios] = useState([]);
  const [conversor, setConversor] = useState([]);

  const [arrayTablasJugadores, setArrayTablasJugadores] = useState([]);
  const [vistaActual, setVistaActual] = useState('');
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
      const json = JSON.parse(data);
      const { action } = json;
      console.log(json);
      if (action === 'ACTUALIZAR_JUGADORES_MANAGER') {
        console.log('se debe actualizar x un cambio');
        console.log(json.arrayTablasJugadores);
        if (json.arrayTablasJugadores !== undefined) {
          setArrayTablasJugadores(json.arrayTablasJugadores);
        }
        setVistaActual(json.vistaActual);
      } else {
        const users = json.usersOnline;
        const conv = json.conversorJugadores;
        if (users !== undefined && conv !== undefined) {
          const jsonUsers = JSON.parse(users);
          setDataUsuarios(jsonUsers);
          setConversor(conv);
        }
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
    setModalConfirmacionSiguienteActividad(
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

  const onSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
    };

    console.log(payload);
    const jsonSend = {
      tipo: 'ADMIN_CREAR_SESION',
      tratamiento: parseInt(payload.tratamiento, 10),
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);

    setTimeout(() => {
      console.log(payload);
      setModalCrearSesion(!modalCrearSesion);
      setSubmitting(false);
    }, 500);
  };

  return (
    <Card>
      <CardBody>
        {socketOpen ? (
          <div>
            {' '}
            <Row>
              <Colxx lg="12">
                <Row>
                  <Colxx lg="4">
                    <CardUser
                      internalId={1}
                      dataUsuarios={dataUsuarios}
                      conversor={conversor}
                    />{' '}
                  </Colxx>
                  <Colxx lg="4">
                    <CardUser
                      internalId={2}
                      dataUsuarios={dataUsuarios}
                      conversor={conversor}
                    />{' '}
                  </Colxx>
                  <Colxx lg="4">
                    <CardUser
                      internalId={3}
                      dataUsuarios={dataUsuarios}
                      conversor={conversor}
                    />{' '}
                  </Colxx>
                  <Colxx lg="4">
                    <CardUser
                      internalId={4}
                      dataUsuarios={dataUsuarios}
                      conversor={conversor}
                    />{' '}
                  </Colxx>
                  <Colxx lg="4">
                    <CardUser
                      internalId={5}
                      dataUsuarios={dataUsuarios}
                      conversor={conversor}
                    />{' '}
                  </Colxx>
                  <Colxx lg="4">
                    <CardUser
                      internalId={6}
                      dataUsuarios={dataUsuarios}
                      conversor={conversor}
                    />{' '}
                  </Colxx>
                </Row>
              </Colxx>
              <Colxx lg="12">
                <Card className="mb-2">
                  <CardBody> Vista Actual: {vistaActual}</CardBody>
                </Card>
              </Colxx>
              <Colxx lg="12">
                <TablaJugadores arrayTablasJugadores={arrayTablasJugadores} />
              </Colxx>
            </Row>
          </div>
        ) : (
          <> Por favor recargar la pag F5</>
        )}
      </CardBody>
      <CardFooter>
        <Button onClick={() => setModalCrearSesion(!modalCrearSesion)}>
          Nueva Sesion
        </Button>
        <Button
          onClick={() =>
            setModalConfirmacionSiguienteActividad(
              !modalConfirmacionSiguienteActividad
            )
          }
        >
          Siguiente actividad
        </Button>
        <Button
          onClick={() =>
            setModalConfirmacionEncuesta(!modalConfirmacionEncuesta)
          }
        >
          Comenzar encuesta
        </Button>
      </CardFooter>
      <Modal
        isOpen={modalConfirmacionSiguienteActividad}
        toggle={() =>
          setModalConfirmacionSiguienteActividad(
            !modalConfirmacionSiguienteActividad
          )
        }
      >
        <ModalHeader>
          Seguro que quiere comenzar la nueva actividad ?
        </ModalHeader>

        <ModalFooter>
          <Button color="primary" onClick={() => comenzarSiguienteActividad()}>
            SI
          </Button>{' '}
          <Button
            color="secondary"
            outline
            onClick={() =>
              setModalConfirmacionSiguienteActividad(
                !modalConfirmacionSiguienteActividad
              )
            }
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalConfirmacionEncuesta}
        toggle={() => setModalConfirmacionEncuesta(!modalConfirmacionEncuesta)}
      >
        <ModalHeader>Seguro que quiere comenzar la encuesta ?</ModalHeader>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              comenzarEncuesta();
              setModalConfirmacionEncuesta(!modalConfirmacionEncuesta);
            }}
          >
            SI
          </Button>{' '}
          <Button
            color="secondary"
            outline
            onClick={() =>
              setModalConfirmacionEncuesta(!modalConfirmacionEncuesta)
            }
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalCrearSesion}
        toggle={() => setModalCrearSesion(!modalCrearSesion)}
      >
        <ModalHeader>Crear Sesión</ModalHeader>
        <Formik
          initialValues={{
            tratamiento: 1,
          }}
          onSubmit={onSubmit}
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
            <Form className="av-tooltip tooltip-label-right">
              <CardBody>
                <FormGroup className="error-l-100 pt-3 pl-3 pr-3" row>
                  <Label sm={6}>Tratamiento a realizar</Label>
                  <Colxx sm={6}>
                    {' '}
                    <select
                      name="tratamiento"
                      className="form-control"
                      value={values.tratamiento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {tratamientosOptions.map((item, i) => {
                        return (
                          <option value={item.value} key={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                  </Colxx>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button className="mt-2" block type="submit">
                  Crear
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </Card>
  );
};
export default Experimento2;
