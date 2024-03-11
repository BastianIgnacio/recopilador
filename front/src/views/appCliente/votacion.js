/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import {
  Row,
  Card,
  CardBody,
  Label,
  CardTitle,
  FormGroup,
  Button,
  CardFooter,
  CardSubtitle,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import {
  colorBlue,
  colorLightBlue,
  colorLightYellow,
  colorPlomo,
  colorYellow,
} from 'constants/defaultValues';
import { NotificationManager } from 'components/common/react-notifications';

import { useTable, usePagination, useSortBy } from 'react-table';
import DatatablePagination from 'components/DatatablePagination';

import { FormikCustomRadioGroupMax } from './FormikFields';

const Votacion = ({
  match,
  id,
  socketConectado,
  club,
  ws,
  bloqueado,
  setBloqueadoView,
  rondaActual,
  rondasTotales,
  arrayJugadores,
  arrayTablasJugadores,
  info,
  mostrarVotacion,
}) => {
  const senalarJugador = (array) => {
    // eslint-disable-next-line func-names
    array.forEach(function (i) {
      if (i.id === id) {
        // eslint-disable-next-line no-param-reassign
        i.jugador = `(USTED) Jugador ${i.id}`;
      }
    });
  };

  senalarJugador(arrayTablasJugadores);
  const generarOpcionesVotacion = (array) => {
    const arrayOpctions = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < array.length; i++) {
      if (array[i].club === 'AZUL') {
        if (array[i].client_id !== id) {
          const a = {
            value: array[i].client_id,
            label: `Jugador ${array[i].client_id}`,
            disabled: false,
          };
          arrayOpctions.push(a);
        }
      } else if (array[i].client_id !== id) {
        const a = {
          value: array[i].client_id,
          label: `Jugador ${array[i].client_id}`,
          disabled: true,
        };
        arrayOpctions.push(a);
      }
    }
    arrayOpctions.push({
      value: 'no',
      label: 'No trasladar a ningun integrante',
    });
    return arrayOpctions;
  };

  const colsRetirosJugadores = React.useMemo(
    () => [
      {
        Header: 'Jugador / Ronda',
        accessor: 'jugador',
        cellClass: 'w-10',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-1',
        accessor: 'ronda_1',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-2',
        accessor: 'ronda_2',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-3',
        accessor: 'ronda_3',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-4',
        accessor: 'ronda_4',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-5',
        accessor: 'ronda_5',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-6',
        accessor: 'ronda_6',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-7',
        accessor: 'ronda_7',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-8',
        accessor: 'ronda_8',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-9',
        accessor: 'ronda_9',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-10',
        accessor: 'ronda_10',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Ganancias en esta ronda',
        accessor: 'ganancia_ultima_ronda',
        cellClass: 'mw-15',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Ganacias acumuladas',
        accessor: 'gananciaAcumulada',
        cellClass: 'mw-15',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
    ],
    []
  );

  function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      prepareRow,
      headerGroups,
      page,
      canPreviousPage,
      canNextPage,
      pageCount,
      gotoPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 8 },
      },
      useSortBy,
      usePagination
    );
    return (
      <>
        <table
          {...getTableProps()}
          className="r-table table table-fixed"
          style={{
            color: 'black',
            borderStyle: 'solid',
            borderRadius: '10px',
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    key={`th_${columnIndex}`}
                    style={{
                      backgroundColor: colorPlomo,
                      maxWidth: '100px',
                      textAlign: 'center',
                    }}
                  >
                    {column.render('Header')}
                    <span />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <>
                  {row.original.club === 'AZUL' && row.original.id !== id && (
                    <tr
                      {...row.getRowProps()}
                      style={{
                        backgroundColor: colorLightBlue,
                        color: 'black',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={`td_${cellIndex}`}
                          style={{
                            color: 'black',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )}
                  {row.original.club === 'AZUL' && row.original.id === id && (
                    <tr
                      {...row.getRowProps()}
                      style={{
                        backgroundColor: colorLightBlue,
                        color: 'black',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: 950,
                      }}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={`td_${cellIndex}`}
                          style={{
                            color: 'black',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )}
                  {row.original.club === 'AMARILLO' && row.original.id !== id && (
                    <tr
                      {...row.getRowProps()}
                      style={{
                        backgroundColor: colorLightYellow,
                        color: 'black',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={`td_${cellIndex}`}
                          style={{
                            color: 'black',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )}
                  {row.original.club === 'AMARILLO' && row.original.id === id && (
                    <tr
                      {...row.getRowProps()}
                      style={{
                        backgroundColor: colorLightYellow,
                        color: 'black',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: 950,
                      }}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={`td_${cellIndex}`}
                          style={{
                            color: 'black',
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )}
                  {row.original.club === 'total' && (
                    <tr
                      {...row.getRowProps()}
                      style={{
                        borderRadius: '10px',
                        backgroundColor: colorPlomo,
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                      className="mb-1"
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <>
                          {cellIndex === 0 && (
                            <td
                              key={`td_${cellIndex}`}
                              style={{
                                color: 'black',
                                textAlign: 'right',
                              }}
                            >
                              {cell.render('Cell')}
                            </td>
                          )}
                          {cellIndex !== 0 && (
                            <td
                              key={`td_${cellIndex}`}
                              style={{
                                color: 'black',
                                textAlign: 'center',
                              }}
                            >
                              {cell.render('Cell')}
                            </td>
                          )}
                        </>
                      ))}
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }

  const enviarVotacion = (data) => {
    const jsonSend = {
      tipo: 'CLIENTE_ENVIAR_VOTACION',
      data,
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };
  const onSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
    };
    if (payload.customRadioGroup.length === 0) {
      NotificationManager.warning(
        '',
        'Debes seleccionar una opción',
        3000,
        null,
        null,
        'filled'
      );
      return;
    }
    console.log(payload);
    const data = {
      cliente: id,
      club,
      votacion: payload.customRadioGroup,
    };
    setTimeout(() => {
      setBloqueadoView(true);
      enviarVotacion(data);

      setSubmitting(false);
    }, 100);
  };
  return (
    <>
      {club === 'AZUL' && (
        <Row className="d-flex justify-content-center">
          <Colxx lg="9">
            <Card className="mb-4">
              <div style={{ backgroundColor: colorBlue, borderRadius: '10px' }}>
                <div className="text-center mt-3 ml-3">
                  <Label className="h5" style={{ color: 'white' }}>
                    FICHAS RETIRADAS DESDE EL CLUB AZUL Y GANANCIAS
                  </Label>
                </div>
              </div>
              <CardBody>
                <Table
                  columns={colsRetirosJugadores}
                  data={arrayTablasJugadores}
                />
              </CardBody>
            </Card>
          </Colxx>
          {mostrarVotacion && (
            <Colxx lg="3">
              <Card className="mb-4">
                <div
                  style={{ backgroundColor: colorBlue, borderRadius: '10px' }}
                >
                  <div className="text-center mt-3 ml-3">
                    <Label className="h5" style={{ color: 'white' }}>
                      VOTACIÓN
                    </Label>
                  </div>
                </div>
                <Formik
                  initialValues={{
                    customRadioGroup: [],
                  }}
                  // validationSchema={SignupSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <Form className="av-tooltip tooltip-label-right">
                      <CardBody>
                        <CardTitle>
                          En esta ronda usted puede votar para trasladar un
                          maximo de 2 integrantes al club amarillo.
                        </CardTitle>
                        <FormGroup className="error-l-175">
                          <FormikCustomRadioGroupMax
                            name="customRadioGroup"
                            id="customRadioGroup"
                            label="Which of these?"
                            values={values.customRadioGroup}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            options={generarOpcionesVotacion(arrayJugadores)}
                            max={2}
                          />
                          {errors.customRadioGroup &&
                          touched.customRadioGroup ? (
                            <div className="invalid-feedback d-block">
                              {errors.customRadioGroup}
                            </div>
                          ) : null}
                        </FormGroup>
                      </CardBody>
                      <CardFooter>
                        <Button
                          block
                          style={{
                            backgroundColor: colorBlue,
                            fontWeight: 'bold',
                            fontSize: '12px',
                          }}
                          type="submit"
                          disabled={bloqueado}
                        >
                          {!bloqueado
                            ? 'Enviar Votación'
                            : 'Esperando a los otros participantes..'}
                        </Button>
                      </CardFooter>
                    </Form>
                  )}
                </Formik>
              </Card>
            </Colxx>
          )}
        </Row>
      )}
      {club === 'AMARILLO' && (
        <Row className="d-flex justify-content-center">
          <Colxx lg="9">
            <Card className="mb-4">
              <div
                style={{ backgroundColor: colorYellow, borderRadius: '10px' }}
              >
                <div className="text-center mt-3 ml-3">
                  <Label className="h5" style={{ color: 'white' }}>
                    FICHAS RETIRADAS DESDE EL CLUB AZUL Y GANANCIAS
                  </Label>
                </div>
              </div>
              <CardBody>
                <Table
                  columns={colsRetirosJugadores}
                  data={arrayTablasJugadores}
                />
              </CardBody>
            </Card>
          </Colxx>
          {mostrarVotacion && (
            <>
              {info.tratamiento !== 'T1' && (
                <Colxx lg="3">
                  <Card className="mb-4">
                    <div
                      style={{
                        backgroundColor: colorYellow,
                        borderRadius: '10px',
                      }}
                    >
                      <div className="text-center mt-3 ml-3">
                        <Label
                          className="h3"
                          style={{ color: 'white', fontWeight: 'bold' }}
                        >
                          VOTACIÓN
                        </Label>
                      </div>
                    </div>
                    <CardBody>
                      <CardTitle
                        className="text-center"
                        style={{ fontWeight: 'bold' }}
                      >
                        NO PUEDES VOTAR
                      </CardTitle>
                    </CardBody>
                    <CardFooter>
                      <CardSubtitle className="text-center">
                        ESPERANDO LA VOTACIÓN DE LOS INTEGRANTES DEL CLUB AZUL
                      </CardSubtitle>
                    </CardFooter>
                  </Card>
                </Colxx>
              )}
            </>
          )}
        </Row>
      )}
    </>
  );
};

export default Votacion;
