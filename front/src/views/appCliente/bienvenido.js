/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Card,
  Button,
  CardBody,
  CardText,
  CardTitle,
  CardFooter,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import { Colxx, Separator } from 'components/common/CustomBootstrap';

const Bienvenido = ({ match, ws, client_id, entorno }) => {
  const [bloqueado, setBloqueado] = useState(false);

  const confirmar = () => {
    const jsonData = {
      tipo: 'CONFIRMAR_BIENVENIDO',
      data: '',
    };
    const jsonToSend = JSON.stringify(jsonData);
    ws.send(jsonToSend);
    setBloqueado(true);
  };

  useEffect(() => {
    const vistasBloqueadas = entorno.vistas;
    const vistaBloqueada = vistasBloqueadas.find(
      (vistaElement) => vistaElement.client_id === client_id
    );
    setBloqueado(vistaBloqueada.bloqueado);
  }, [client_id, entorno]);

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx lg="6">
          <Card className="mb-4">
            <CardBody>
              <div className="text-center">
                <CardText className="font-weight-bold mb-3 h5">
                  Bienvenido y gracias por aceptar participar.
                </CardText>
                <CardText className="font-weight-bold mb-3 h5">
                  Por favor silenciar o apagar su telefono movil.
                </CardText>
                <CardText className="font-weight-bold h5">
                  Por favor no hablar o comunicarse con los demas participantes.
                </CardText>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                block
                size="sm"
                disabled={bloqueado}
                onClick={() => confirmar()}
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                }}
              >
                {!bloqueado
                  ? 'Comenzar'
                  : 'Esperando a los otros participantes..'}
              </Button>
            </CardFooter>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default Bienvenido;
