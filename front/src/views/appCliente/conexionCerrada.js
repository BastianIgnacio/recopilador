/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Row, Card, Button, CardBody, CardText } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ConexionCerrada = ({ match }) => {
  var ws = null;
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx lg="4">
          <Card className="mb-4">
            <CardBody>
              <div className="text-center">
                <CardText className="text-muted text-medium">
                  Error, se ha perdido la conexion con el servidor
                </CardText>
                <CardText className="text-muted text-medium">
                  Actualizar con F5 por favor!
                </CardText>
              </div>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default ConexionCerrada;
