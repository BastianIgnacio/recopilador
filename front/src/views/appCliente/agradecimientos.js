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

const Agradecimientos = ({
  match,
  id,
  socketConectado,
  ws,
  bloqueado,
  setBloqueadoView,
}) => {
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx lg="6">
          <Card className="mb-4">
            <CardBody>
              <div className="text-center">
                <CardText className="text-muted text-medium mb-4 h5">
                  GRACIAS POR PARTICIPAR
                </CardText>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                block
                size="sm"
                disabled={bloqueado}
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

export default Agradecimientos;
