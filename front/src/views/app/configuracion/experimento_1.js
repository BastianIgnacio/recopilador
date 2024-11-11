/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomSelectInput from 'components/common/CustomSelectInput';
import Select from 'react-select';
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
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Formik, Form, Field } from 'formik';
// eslint-disable-next-line import/no-unresolved
import {
  colorPlomo,
  wsAPI1,
  vistasOptions,
  tratamientosOptions,
} from 'constants/defaultValues';
import CardUser from './cardUser';
import TablaRetiros from './tablaRetiros';
import './transiciones.css';

const Experimento1 = ({ match }) => {
  // websocket comunicacion
  const [ws, setWs] = useState(null);
  const [socketOpen, setSocketOpen] = useState(false);

  // JUEGO
  const [entorno, setEntorno] = useState([]);
  const [usersOnline, setUserOnline] = useState([]);

  const [mostrarTabla, setMostrarTabla] = useState(false);

  // MODALS
  const [modalCrearJuego, setModalCrearJuego] = useState(false);
  const [modalIniciarActividad, setModalIniciarActividad] = useState(false);

  const [conversor, setConversor] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const websocket = new WebSocket(`${wsAPI1}1000`);
    websocket.onopen = () => {
      setWs(websocket);
    };
    websocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      const { tipo } = data;

      if (tipo === 'DATOS_ENTORNO') {
        setEntorno(data.entorno);
      }

      // ACA SE CONECTA O SE DESCONECTA UN USUARIO
      if (tipo === 'NUEVA_CONEXION' || tipo === 'DESCONEXION') {
        setUserOnline(JSON.parse(data.usersOnline));
      }

      if (tipo === 'NUEVA_CONEXION_ADMIN') {
        setUserOnline(JSON.parse(data.usersOnline));
      }
      if (tipo === 'MOSTRAR_TABLA') {
        setMostrarTabla(true);
      }
      setSocketOpen(true);
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

  const onSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
    };
    const jsonData = {
      tipo: 'CREAR_JUEGO',
      data: { tratamiento: payload.tratamiento },
    };
    const jsonToSend = JSON.stringify(jsonData);
    ws.send(jsonToSend);

    setTimeout(() => {
      setModalCrearJuego(!modalCrearJuego);
      setSubmitting(false);
    }, 500);
  };

  const iniciarActividad = () => {
    const jsonData = {
      tipo: 'INICIAR_SIGUIENTE_ACTIVIDAD',
      data: {},
    };
    const jsonToSend = JSON.stringify(jsonData);
    ws.send(jsonToSend);
  };

  return (
    <Card>
      <CardBody transition-style="in:circle:top-right">
        {socketOpen ? (
          <div>
            <Row>
              <Colxx lg="12">
                <Card className="mb-2">
                  <CardBody>
                    <Row>
                      <Colxx lg="9">
                        {entorno.estado === 'INICIO' && (
                          <Colxx>
                            <Button
                              onClick={() =>
                                setModalCrearJuego(!modalCrearJuego)
                              }
                            >
                              NUEVA SESION
                            </Button>
                          </Colxx>
                        )}

                        {entorno.estado === 'ACTIVIDAD_PRUEBA' && (
                          <Colxx>
                            ESTAMOS REALIZANDO LA ACTIVIDAD DE PRUEBA
                          </Colxx>
                        )}
                        {entorno.estadoAdmin ===
                          'MOSTRANDO_RESUMEN_ACTIVIDAD' && (
                          <Colxx>
                            <Button
                              onClick={() =>
                                setModalIniciarActividad(!modalIniciarActividad)
                              }
                            >
                              INICIAR ACTIVIDAD
                            </Button>
                          </Colxx>
                        )}
                      </Colxx>
                      <Colxx lg="3">
                        <div className="d-flex justify-content-start mb-1">
                          {entorno.estado}
                        </div>
                        <div className="d-flex justify-content-around mb-1">
                          <CardUser
                            internalId={1}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={2}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={3}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={4}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={5}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={6}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={7}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                          <CardUser
                            internalId={8}
                            dataUsuarios={usersOnline}
                            conversor={conversor}
                          />
                        </div>
                      </Colxx>
                    </Row>
                  </CardBody>
                </Card>
              </Colxx>
              {entorno.juegoCreado && (
                <Colxx lg="12">
                  <Card>
                    <CardBody>
                      <TablaRetiros tabla={entorno.actividad.tablaAdmin} />
                    </CardBody>
                  </Card>
                </Colxx>
              )}
            </Row>
          </div>
        ) : (
          <> Por favor recargar la pag F5</>
        )}
      </CardBody>
      <Modal
        isOpen={modalCrearJuego}
        toggle={() => setModalCrearJuego(!modalCrearJuego)}
      >
        <ModalHeader>Crear Sesión</ModalHeader>
        <Formik
          initialValues={{
            tratamiento: 'T1',
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
                            {item.label} {item.description}
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
      <Modal
        isOpen={modalIniciarActividad}
        toggle={() => setModalIniciarActividad(!modalIniciarActividad)}
      >
        <ModalHeader>
          SEGURO QUE QUIERES COMENZAR LA SIGUIENTE ACTIVIDAD ?
        </ModalHeader>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              iniciarActividad();
              setModalIniciarActividad(!modalIniciarActividad);
            }}
          >
            SI
          </Button>{' '}
          <Button
            color="secondary"
            outline
            onClick={() => setModalIniciarActividad(!modalIniciarActividad)}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};
export default Experimento1;
