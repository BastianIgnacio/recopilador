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

const JugadorLabel = ({ client_id, element, transicionInclusion }) => {
  const ud = '(USTED)';
  return (
    <>
      {element.club === 'AZUL' && !element.trasladadoAzulAAmarillo && (
        <div
          style={{ backgroundColor: colorBlue, borderRadius: '5px' }}
          className="ml-4 mr-4 mt-2 mb-2 "
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
      {element.club === 'AZUL' && element.trasladadoAzulAAmarillo && (
        <div
          style={{ backgroundColor: colorYellow, borderRadius: '5px' }}
          className="ml-4 mr-4 mt-2 mb-2 "
        >
          <div className="text-center ">
            <Label className="h5 mb-3 mt-3" style={{ fontWeight: 'bold' }}>
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
      {element.club === 'AMARILLO' && (
        <>
          {transicionInclusion.includes(element.client_id) ? (
            <div
              style={{ borderRadius: '5px', backgroundColor: colorBlue }}
              className="ml-4 mr-4 mt-2 mb-2 transicion-votacion-Amarillo-Azul"
            >
              <div className="text-center transicion-votacion-Amarillo-Azul">
                <Label
                  className="h5 mb-3 mt-3 transicion-votacion-Amarillo-Azul"
                  style={{ fontWeight: 'bold', color: 'white' }}
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
              style={{ backgroundColor: colorYellow, borderRadius: '5px' }}
              className="ml-4 mr-4 mt-2 mb-2 "
            >
              <div className="text-center ">
                <Label
                  className="h5 mb-3 mt-3"
                  style={{ color: 'black', fontWeight: 'bold' }}
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
