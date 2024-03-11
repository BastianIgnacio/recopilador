/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Row, Card, CardBody, Label } from 'reactstrap';
import { colorBlue, colorYellow, colorPlomo } from 'constants/defaultValues';

const JugadorLabel = ({ id, element, traslados }) => {
  const ud = '(USTED)';
  return (
    <>
      {element.club === 'AMARILLO' && traslados.includes(element.client_id) && (
        <div
          style={{ backgroundColor: colorYellow, borderRadius: '5px' }}
          className="ml-4 mr-4 mt-2 mb-2 transicion-votacion"
        >
          <div className="text-center transicion-votacion">
            <Label
              className="h5 mb-3 mt-3"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {element.client_id === id && (
                <>
                  {ud} Jugador {element.client_id}
                </>
              )}
              {element.client_id !== id && <> Jugador {element.client_id} </>}
            </Label>
          </div>
        </div>
      )}
      {element.club === 'AMARILLO' && !traslados.includes(element.client_id) && (
        <div
          style={{ backgroundColor: colorYellow, borderRadius: '10px' }}
          className="ml-4 mr-4 mt-2 mb-2"
        >
          <div className="text-center">
            <Label
              className="h5 mb-3 mt-3"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {element.client_id === id && (
                <>
                  {ud} Jugador {element.client_id}
                </>
              )}
              {element.client_id !== id && <> Jugador {element.client_id} </>}
            </Label>
          </div>
        </div>
      )}
      {element.club === 'AZUL' && (
        <div
          style={{ backgroundColor: colorBlue, borderRadius: '10px' }}
          className="ml-4 mr-4 mt-2 mb-2"
        >
          <div className="text-center">
            <Label
              className="h5 mt-2 mb-2"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {element.client_id === id && (
                <>
                  {ud} Jugador {element.client_id}
                </>
              )}
              {element.client_id !== id && <> Jugador {element.client_id} </>}
            </Label>
          </div>
        </div>
      )}
    </>
  );
};

export default JugadorLabel;
