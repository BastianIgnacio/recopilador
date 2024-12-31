/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  colorBlue,
  colorLightBlue,
  colorLightYellow,
  colorPlomo,
  colorYellow,
  colorOrange,
  colorAmarilloEliminado,
} from 'constants/defaultValues';
import { Card, CardBody, CardTitle, Label } from 'reactstrap';
import { Separator } from 'components/common/CustomBootstrap';

const TablaRetiros = ({ match, client_id, entorno }) => {
  // TENEMOS EL LABEL DE LA RONDA ACTUAL
  const labelRondalActual = `ronda_${entorno.actividad.rondaActual}`;
  const amarillos = entorno.actividad.tablaAsignacion.filter(
    (j) => j.color === 'AMARILLO'
  );

  // eslint-disable-next-line func-names
  /*
  amarillos.forEach(function (i) {
    const { rondaActual } = entorno.actividad;

    switch (rondaActual) {
      case 1:
        // eslint-disable-next-line no-param-reassign
        i.ronda_1 = '-';
        break;
      case 2:
        // eslint-disable-next-line no-param-reassign
        i.ronda_2 = '-';
        break;
      case 3:
        // eslint-disable-next-line no-param-reassign
        i.ronda_3 = '-';
        break;
      case 4:
        // eslint-disable-next-line no-param-reassign
        i.ronda_4 = '-';
        break;
      case 5:
        // eslint-disable-next-line no-param-reassign
        i.ronda_5 = '-';
        break;
      case 5:
          // eslint-disable-next-line no-param-reassign
          i.ronda_5 = '-';
          break;
      default:
        console.log(`ERROR AL OCULTAR`);
    }
  });

  */
  // eslint-disable-next-line prettier/prettier
  const azules = entorno.actividad.tablaAsignacion.filter((j) => j.color === 'AZUL');
  // eslint-disable-next-line func-names
  /*
  azules.forEach(function (i) {
    const { rondaActual } = entorno.actividad;

    switch (rondaActual) {
      case 1:
        // eslint-disable-next-line no-param-reassign
        i.ronda_1 = '-';
        break;
      case 2:
        // eslint-disable-next-line no-param-reassign
        i.ronda_2 = '-';
        break;
      case 3:
        // eslint-disable-next-line no-param-reassign
        i.ronda_3 = '-';
        break;
      default:
        console.log(`ERROR AL OCULTAR`);
    }
  });
  */

  const colsRetirosJugadores = React.useMemo(
    () => [
      {
        Header: 'Jugador / Ronda',
        accessor: 'label',
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
        Header: 'R-11',
        accessor: 'ronda_11',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'R-12',
        accessor: 'ronda_12',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Ganancias en la ultima ronda',
        accessor: 'gananciaUltimaRonda',
        cellClass: 'mw-15',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Ganacias acumuladas',
        accessor: 'gananciasAcumuladas',
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
        initialState: { pageIndex: 0, pageSize: 9 },
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
              console.log(row);
              return (
                <>
                  {row.original.color === 'AMARILLO' && (
                    <>
                      {row.original.rowTotal && (
                        <tr
                          {...row.getRowProps()}
                          style={{
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {row.cells.map((cell, cellIndex) => (
                            <>
                              {typeof cell.value === 'undefined' && (
                                <td
                                  key={`td_${cellIndex}`}
                                  style={{
                                    color: 'black',
                                    backgroundColor: colorPlomo,
                                  }}
                                >
                                  -
                                </td>
                              )}
                              {typeof cell.value !== 'undefined' && (
                                <td
                                  key={`td_${cellIndex}`}
                                  style={{
                                    color: 'black',
                                    backgroundColor: colorPlomo,
                                  }}
                                >
                                  {cell.render('Cell')}
                                </td>
                              )}
                            </>
                          ))}
                        </tr>
                      )}
                      {row.original.jugador === client_id && (
                        <tr
                          {...row.getRowProps()}
                          style={{
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {row.cells.map((cell, cellIndex) => (
                            <>
                              {typeof cell.value === 'undefined' && (
                                <td
                                  key={`td_${cellIndex}`}
                                  style={{
                                    color: 'black',
                                    backgroundColor: colorPlomo,
                                  }}
                                >
                                  -
                                </td>
                              )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'PLOMO_JUGADOR' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorYellow,
                                    }}
                                    className="d-flex justify-content-around"
                                  >
                                    <span className="dotAmarilloBordeBlanco" />
                                    {`USTED ${cell.value[0]}`}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'PLOMO' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorPlomo,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'AZUL' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorLightBlue,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'AMARILLO' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorLightYellow,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'PLOMO_EXTRA' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorPlomo,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                            </>
                          ))}
                        </tr>
                      )}
                      {row.original.jugador !== client_id &&
                        !row.original.rowTotal && (
                          <tr
                            {...row.getRowProps()}
                            style={{
                              fontSize: '12px',
                              textAlign: 'center',
                              fontWeight: 600,
                            }}
                          >
                            {row.cells.map((cell, cellIndex) => (
                              <>
                                {typeof cell.value === 'undefined' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorPlomo,
                                    }}
                                  >
                                    -
                                  </td>
                                )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'PLOMO_JUGADOR' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorPlomo,
                                      }}
                                      className="d-flex justify-content-around"
                                    >
                                      <span className="dotAmarillo" />
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'AZUL' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorLightBlue,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'AMARILLO' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorLightYellow,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'PLOMO' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorPlomo,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'PLOMO_EXTRA' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorPlomo,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                              </>
                            ))}
                          </tr>
                        )}
                    </>
                  )}
                  {row.original.color === 'AZUL' && (
                    <>
                      {row.original.rowTotal && (
                        <tr
                          {...row.getRowProps()}
                          style={{
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {row.cells.map((cell, cellIndex) => (
                            <>
                              {typeof cell.value === 'undefined' && (
                                <td
                                  key={`td_${cellIndex}`}
                                  style={{
                                    color: 'black',
                                    backgroundColor: colorPlomo,
                                  }}
                                >
                                  -
                                </td>
                              )}
                              {typeof cell.value !== 'undefined' && (
                                <td
                                  key={`td_${cellIndex}`}
                                  style={{
                                    color: 'black',
                                    backgroundColor: colorPlomo,
                                  }}
                                >
                                  {cell.render('Cell')}
                                </td>
                              )}
                            </>
                          ))}
                        </tr>
                      )}
                      {row.original.jugador === client_id && (
                        <tr
                          {...row.getRowProps()}
                          style={{
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {row.cells.map((cell, cellIndex) => (
                            <>
                              {typeof cell.value === 'undefined' && (
                                <td
                                  key={`td_${cellIndex}`}
                                  style={{
                                    color: 'black',
                                    backgroundColor: colorPlomo,
                                  }}
                                >
                                  -
                                </td>
                              )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'PLOMO_JUGADOR' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'white',
                                      backgroundColor: colorBlue,
                                    }}
                                    className="d-flex justify-content-around"
                                  >
                                    <span className="dotAzulBordeBlanco" />
                                    {`USTED ${cell.value[0]}`}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'PLOMO' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorPlomo,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'AZUL' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorLightBlue,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'AMARILLO' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorLightYellow,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                              {typeof cell.value !== 'undefined' &&
                                cell.value[1] === 'PLOMO_EXTRA' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorPlomo,
                                    }}
                                  >
                                    {cell.value[0]}
                                  </td>
                                )}
                            </>
                          ))}
                        </tr>
                      )}
                      {row.original.jugador !== client_id &&
                        !row.original.rowTotal && (
                          <tr
                            {...row.getRowProps()}
                            style={{
                              fontSize: '12px',
                              textAlign: 'center',
                              fontWeight: 600,
                            }}
                          >
                            {row.cells.map((cell, cellIndex) => (
                              <>
                                {typeof cell.value === 'undefined' && (
                                  <td
                                    key={`td_${cellIndex}`}
                                    style={{
                                      color: 'black',
                                      backgroundColor: colorPlomo,
                                    }}
                                  >
                                    -
                                  </td>
                                )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'PLOMO_JUGADOR' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorPlomo,
                                      }}
                                      className="d-flex justify-content-around"
                                    >
                                      <span className="dot" />
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'AZUL' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorLightBlue,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'AMARILLO' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorLightYellow,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'PLOMO' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorPlomo,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                                {typeof cell.value !== 'undefined' &&
                                  cell.value[1] === 'PLOMO_EXTRA' && (
                                    <td
                                      key={`td_${cellIndex}`}
                                      style={{
                                        color: 'black',
                                        backgroundColor: colorPlomo,
                                      }}
                                    >
                                      {cell.value[0]}
                                    </td>
                                  )}
                              </>
                            ))}
                          </tr>
                        )}
                    </>
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
      <Card>
        <div
          style={{
            backgroundColor: colorBlue,
          }}
        >
          <div>
            <Label
              className="h5 m-1 mt-2 ml-4"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Club Azul - Fichas retiradas y ganancias
            </Label>
          </div>
        </div>
        <div className="m-1">
          <Table columns={colsRetirosJugadores} data={azules} />
        </div>
      </Card>
      <Separator className="m-1" />
      <Card>
        <div
          style={{
            backgroundColor: colorYellow,
          }}
        >
          <div>
            <Label
              className="h5 m-1 mt-2 ml-4"
              style={{ color: 'black', fontWeight: 'bold' }}
            >
              Club Amarillo - Fichas retiradas y ganancias
            </Label>
          </div>
        </div>
        <div className="m-1">
          <Table columns={colsRetirosJugadores} data={amarillos} />
        </div>
      </Card>
    </>
  );
};

export default TablaRetiros;
