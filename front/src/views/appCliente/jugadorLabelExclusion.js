/* eslint-disable camelcase */
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
import './transiciones.css';

const JugadorLabel = ({ client_id, element, transicionExclusion }) => {
  const ud = '(USTED)';
  return (
    <>
      {element.club === 'AMARILLO' && (
        <div
          style={{ backgroundColor: colorYellow, borderRadius: '5px' }}
          className="m-1"
        >
          <div className="text-center">
            <Label
              className="h5 mb-3 mt-3"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {element.client_id === client_id && (
                <>
                  {ud} Jugador {element.letra}
                </>
              )}
              {element.client_id !== client_id && (
                <> Jugador {element.letra} </>
              )}
            </Label>
          </div>
        </div>
      )}
      {element.club === 'AZUL' && (
        <>
          {transicionExclusion.includes(element.client_id) ? (
            <div
              style={{ backgroundColor: colorYellow, borderRadius: '5px' }}
              className="m-1 transicion-votacion-Azul-Amarillo"
            >
              <div className="text-center ">
                <Label
                  className="h5 mb-3 mt-3"
                  style={{ color: 'white', fontWeight: 'bold' }}
                >
                  {element.client_id === client_id && (
                    <>
                      {ud} Jugador {element.letra}
                    </>
                  )}
                  {element.client_id !== client_id && (
                    <> Jugador {element.letra} </>
                  )}
                </Label>
              </div>
            </div>
          ) : (
            <div
              style={{ backgroundColor: colorBlue, borderRadius: '5px' }}
              className="m-1 "
            >
              <div className="text-center ">
                <Label
                  className="h5 mb-3 mt-3"
                  style={{ color: 'white', fontWeight: 'bold' }}
                >
                  {element.client_id === client_id && (
                    <>
                      {ud} Jugador {element.letra}
                    </>
                  )}
                  {element.client_id !== client_id && (
                    <> Jugador {element.letra} </>
                  )}
                </Label>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default JugadorLabel;
