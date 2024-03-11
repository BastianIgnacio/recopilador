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
import { colorBlue } from 'constants/defaultValues';

const Bienvenido = ({
  match,
  id,
  socketConectado,
  ws,
  bloqueado,
  setBloqueadoView,
}) => {
  const comenzar = () => {
    setBloqueadoView(true);
    const data = { cliente: id };
    const jsonSend = {
      tipo: 'CLIENTE_INICIAR_BLOQUES_TRATAMIENTO',
      data,
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx lg="6">
          <Card className="mb-4">
            <CardBody>
              <div className="text-center">
                <CardText className="text-muted text-medium mb-4 h5">
                  Bienvenido y gracias por aceptar participar.
                </CardText>
                <CardText className="text-muted text-medium mb-4 h5">
                  Por favor silenciar o apagar su telefono movil.
                </CardText>
                <CardText className="text-muted text-medium h5">
                  Por favor no hablar o comunicarse con los demas participantes.
                </CardText>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                block
                onClick={comenzar}
                size="sm"
                disabled={bloqueado}
                style={{
                  backgroundColor: colorBlue,
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
