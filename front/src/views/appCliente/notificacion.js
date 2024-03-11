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

const Notificacion = ({ color, mensaje }) => {
  return (
    <>
      {color === 'AMARILLO' && (
        <div
          style={{ backgroundColor: colorYellow, borderRadius: '10px' }}
          className="ml-4 mr-4 mt-2 mb-2"
        >
          <div className="text-center mt-2 ml-4">
            <Label
              className="h3"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {mensaje}
            </Label>
          </div>
        </div>
      )}
      {color === 'AZUL' && (
        <div
          style={{ backgroundColor: colorBlue, borderRadius: '10px' }}
          className="ml-4 mr-4 mt-2 mb-2"
        >
          <div className="text-center mt-2 ml-4">
            <Label
              className="h3"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {mensaje}
            </Label>
          </div>
        </div>
      )}
      {color === 'PLOMO' && (
        <div
          style={{ backgroundColor: colorPlomo, borderRadius: '10px' }}
          className="ml-4 mr-4 mt-2 mb-2"
        >
          <div className="text-center mt-2 ml-4">
            <Label
              className="h3"
              style={{ color: 'black', fontWeight: 'bold' }}
            >
              {mensaje}
            </Label>
          </div>
        </div>
      )}
    </>
  );
};

export default Notificacion;
