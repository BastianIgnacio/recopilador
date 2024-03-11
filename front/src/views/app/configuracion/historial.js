import React, { useState } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import PerfectScrollbar from 'react-perfect-scrollbar';

const data = [
  { nombre: 'experimeto 1', fecha: 'DD-MM-AAAA', id: 1 },
  { nombre: 'experimeto 2', fecha: 'DD-MM-AAAA', id: 2 },
  { nombre: 'experimeto 3', fecha: 'DD-MM-AAAA', id: 3 },
  { nombre: 'experimeto 4', fecha: 'DD-MM-AAAA', id: 4 },
  { nombre: 'experimeto 5', fecha: 'DD-MM-AAAA', id: 5 },
  { nombre: 'experimeto 6', fecha: 'DD-MM-AAAA', id: 6 },
];

const Historial = ({ match }) => {
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalVerMas, setModalVermas] = useState(false);
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.historial" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="menu.historial" />
              </CardTitle>
              <div className="scroll dashboard-list-with-thumbs">
                <PerfectScrollbar
                  options={{ suppressScrollX: true, wheelPropagation: false }}
                >
                  {data.map((exp) => {
                    return (
                      <Card key={exp.id} className="m-2">
                        <div className="position-absolute card-top-buttons">
                          <button
                            type="button"
                            className="btn btn-header-light icon-button"
                            onClick={() => setModalEliminar(!modalEliminar)}
                          >
                            <i className="simple-icon-trash" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-header-light icon-button"
                            onClick={() => setModalVermas(!modalVerMas)}
                          >
                            <i className="simple-icon-options" />
                          </button>
                        </div>
                        <CardBody style={{ borderColor: 'black' }}>
                          <CardTitle>{exp.nombre} </CardTitle>
                          <div>Fecha {exp.fecha} </div>
                          <div>Fecha {exp.fecha} </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </PerfectScrollbar>
              </div>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      <Modal
        size="lg"
        isOpen={modalVerMas}
        toggle={() => setModalVermas(!modalVerMas)}
      >
        <ModalBody>
          <Row>
            <Colxx xxs="12" xs="12" lg="8">
              asd
            </Colxx>
            <Colxx xxs="12" xs="12" lg="4">
              asd
            </Colxx>
            <Colxx xxs="12" xs="12" lg="12">
              asd
            </Colxx>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => setModalVermas(!setModalVermas)}
          >
            Ok
          </Button>{' '}
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalEliminar}
        toggle={() => setModalEliminar(!modalEliminar)}
      >
        <ModalBody>
          <Row>
            <Colxx xxs="12" xs="12" lg="8">
              asd
            </Colxx>
            <Colxx xxs="12" xs="12" lg="4">
              asd
            </Colxx>
            <Colxx xxs="12" xs="12" lg="12">
              asd
            </Colxx>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => setModalEliminar(!setModalEliminar)}
          >
            Eliminar
          </Button>{' '}
          <Button
            color="primary"
            onClick={() => setModalEliminar(!setModalEliminar)}
          >
            Cerrar
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Historial;
