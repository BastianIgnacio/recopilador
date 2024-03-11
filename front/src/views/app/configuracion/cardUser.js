/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Badge,
  CardFooter,
  Button,
  CardSubtitle,
  CardText,
} from 'reactstrap';
import data from 'data/topRatedItems';

const CardUser = ({ idUser, dataUsuarios }) => {
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    const aux = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < dataUsuarios.length; i++) {
      aux.push(dataUsuarios[i].client_id);
    }
    if (aux.includes(idUser.toUpperCase())) {
      setConectado(true);
    } else {
      setConectado(false);
    }
  }, [dataUsuarios, idUser]);

  return (
    <Card className="d-flex flex-row m-1">
      <div className="position-absolute card-top-buttons">
        {conectado && <Button color="success">{idUser}</Button>}
        {!conectado && <Button color="danger">{idUser}</Button>}
      </div>
      <div className=" d-flex flex-grow-1 min-width-zero">
        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
          <div className="min-width-zero">
            {conectado && (
              <CardText className="text-muted text-small ml-3">
                Conectado
              </CardText>
            )}
            {!conectado && (
              <CardText className="text-muted text-small ml-3">
                Desconectado
              </CardText>
            )}
          </div>
        </CardBody>
      </div>
    </Card>
  );
};

export default CardUser;
