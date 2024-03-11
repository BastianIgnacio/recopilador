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
  Button,
  CardBody,
  CardText,
  CardTitle,
  FormGroup,
  Label,
  CardHeader,
  CardFooter,
  CardSubtitle,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  colorBlue,
  colorLightBlue,
  colorLightYellow,
  colorPlomo,
  colorYellow,
} from 'constants/defaultValues';

const AsignarCreditos = ({
  match,
  id,
  ws,
  club,
  ronda,
  bloqueado,
  setBloqueadoView,
  rondaActual,
  rondasTotales,
  arrayTablasJugadores,
  info,
}) => {
  const enviarFichas = (data) => {
    const jsonSend = {
      tipo: 'CLIENTE_ENVIAR_FICHAS',
      data,
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };

  const onSubmit = (values, { setSubmitting }) => {
    setBloqueadoView(true);
    const payload = {
      ...values,
    };
    const data = {
      cliente: id,
      club,
      ronda: rondaActual,
      fichasClub: parseInt(payload.select, 10),
      fichasActividadPrivada: parseInt(payload.actividad, 10),
    };
    setTimeout(() => {
      console.log(data);
      enviarFichas(data);
      setSubmitting(false);
    }, 500);
  };
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
        Header: 'Ganancias en la ultima ronda',
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

  return (
    <>
      {club === 'AZUL' && (
        <Row className="d-flex justify-content-center">
          <Colxx lg="8">
            <Card>
              <CardBody>
                <Table
                  columns={colsRetirosJugadores}
                  data={arrayTablasJugadores}
                />
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="4">
            <Card className="mb-4">
              <div style={{ backgroundColor: colorBlue, borderRadius: '10px' }}>
                <div className="text-center mt-2">
                  <Label
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px',
                    }}
                  >
                    Ingresa tu decisión aqui
                  </Label>
                </div>
              </div>
              <Formik
                initialValues={{
                  select: '0',
                  actividad: 5,
                }}
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
                      <div
                        style={{
                          borderStyle: 'solid',
                          borderRadius: '10px',
                          borderColor: colorBlue,
                        }}
                        className="m-1"
                      >
                        {!bloqueado ? (
                          <>
                            <div className="text-left mt-3 pl-3">
                              <Label style={{ fontWeight: 'bold' }}>
                                Decide cómo asignar tus 5 fichas
                              </Label>
                            </div>
                            <FormGroup
                              className="error-l-100 pt-3 pl-3 pr-3"
                              row
                            >
                              <Label sm={8}>
                                Retirar de la cuenta del club azul
                              </Label>
                              <Colxx sm={4}>
                                {' '}
                                <select
                                  name="select"
                                  className="form-control"
                                  value={values.select}
                                  disabled={bloqueado}
                                  onChange={(event) => {
                                    setFieldValue('select', event.target.value);
                                    const cuentaAzul = parseInt(
                                      event.target.value,
                                      10
                                    );
                                    const activadaPrivada = 5 - cuentaAzul;
                                    setFieldValue('actividad', activadaPrivada);
                                  }}
                                  onBlur={handleBlur}
                                >
                                  <option value="0'">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                                {errors.select && touched.select ? (
                                  <div className="invalid-feedback d-block">
                                    {errors.select}
                                  </div>
                                ) : null}
                              </Colxx>
                            </FormGroup>
                            <FormGroup
                              className="error-l-100 pl-3 pr-3 mb-2"
                              row
                            >
                              <Label sm={8}>Fichas en cuenta privada</Label>
                              <Colxx sm={4}>{values.actividad}</Colxx>
                            </FormGroup>
                          </>
                        ) : (
                          <div className="text-center mt-3 pl-3">
                            <Label style={{ fontWeight: 'bold' }}>
                              Ya fue enviada tu decisión!
                            </Label>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    <CardFooter>
                      <Button
                        className="mt-2"
                        block
                        type="submit"
                        style={{
                          backgroundColor: colorBlue,
                          fontWeight: 'bold',
                          fontSize: '20px',
                        }}
                        disabled={bloqueado}
                      >
                        {!bloqueado
                          ? 'Enviar'
                          : 'Esperando a los otros participantes..'}
                      </Button>
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </Card>
          </Colxx>
        </Row>
      )}
      {club === 'AMARILLO' && (
        <Row className="d-flex justify-content-center">
          <Colxx lg="8">
            <Card>
              <CardBody>
                <Table
                  columns={colsRetirosJugadores}
                  data={arrayTablasJugadores}
                />
              </CardBody>
            </Card>
          </Colxx>
          {info.tratamiento === 'T2' && (
            <Colxx lg="3">
              <Card className="mb-4">
                <div
                  style={{ backgroundColor: colorYellow, borderRadius: '10px' }}
                >
                  <div className="text-center mt-3 ml-3">
                    <Label
                      className="h3"
                      style={{ color: 'white', fontWeight: 'bold' }}
                    >
                      Ronda {rondaActual} de {rondasTotales}
                    </Label>
                  </div>
                </div>
                <CardBody>
                  <CardTitle
                    className="text-center"
                    style={{ fontWeight: 'bold' }}
                  >
                    NO PUEDES ASIGNAR FICHAS
                  </CardTitle>
                </CardBody>
                <CardFooter>
                  <CardSubtitle className="text-center">
                    ESPERANDO LA ASIGNACIÓN DE LOS INTEGRANTES DEL CLUB AZUL
                  </CardSubtitle>
                </CardFooter>
              </Card>
            </Colxx>
          )}
          {info.tratamiento !== 'T2' && (
            <Colxx lg="4">
              <Card className="mb-4">
                <div
                  style={{ backgroundColor: colorYellow, borderRadius: '10px' }}
                >
                  <div className="text-center mt-2">
                    <Label
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px',
                      }}
                    >
                      Ingresa tu decisión aqui
                    </Label>
                  </div>
                </div>
                <Formik
                  initialValues={{
                    select: '0',
                    actividad: 5,
                  }}
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
                        <div
                          style={{
                            borderStyle: 'solid',
                            borderRadius: '10px',
                            borderColor: 'black',
                          }}
                          className="m-1"
                        >
                          {!bloqueado ? (
                            <>
                              <div className="text-left mt-3 pl-3">
                                <Label style={{ fontWeight: 'bold' }}>
                                  Decide cómo asignar tus 5 fichas
                                </Label>
                              </div>
                              <FormGroup
                                className="error-l-100 pt-3 pl-3 pr-3"
                                row
                              >
                                <Label sm={8}>
                                  Retirar de la cuenta del club azul
                                </Label>
                                <Colxx sm={4}>
                                  {' '}
                                  <select
                                    name="select"
                                    className="form-control"
                                    value={values.select}
                                    disabled={bloqueado}
                                    onChange={(event) => {
                                      setFieldValue(
                                        'select',
                                        event.target.value
                                      );
                                      const cuentaAzul = parseInt(
                                        event.target.value,
                                        10
                                      );
                                      const activadaPrivada = 5 - cuentaAzul;
                                      setFieldValue(
                                        'actividad',
                                        activadaPrivada
                                      );
                                    }}
                                    onBlur={handleBlur}
                                  >
                                    <option value="0'">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>
                                  {errors.select && touched.select ? (
                                    <div className="invalid-feedback d-block">
                                      {errors.select}
                                    </div>
                                  ) : null}
                                </Colxx>
                              </FormGroup>
                              <FormGroup
                                className="error-l-100 pl-3 pr-3 mb-2"
                                row
                              >
                                <Label sm={8}>Fichas en cuenta privada</Label>
                                <Colxx sm={4}>{values.actividad}</Colxx>
                              </FormGroup>
                            </>
                          ) : (
                            <div className="text-center mt-3 pl-3">
                              <Label style={{ fontWeight: 'bold' }}>
                                Ya fue enviada tu decisión!
                              </Label>
                            </div>
                          )}
                        </div>
                      </CardBody>
                      <CardFooter>
                        <Button
                          className="mt-1"
                          block
                          type="submit"
                          style={{
                            backgroundColor: colorYellow,
                            fontWeight: 'bold',
                            fontSize: '20px',
                          }}
                          disabled={bloqueado}
                        >
                          {!bloqueado
                            ? 'Enviar'
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
    </>
  );
};

export default AsignarCreditos;
