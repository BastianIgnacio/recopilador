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
} from 'constants/defaultValues';

const TablaRetiros = ({ match, client_id, entorno }) => {
  const senalarJugador = (array) => {
    // eslint-disable-next-line func-names
    array.forEach(function (i) {
      if (i.jugador === client_id) {
        // eslint-disable-next-line no-param-reassign
        i.label = `(USTED) ${i.letra}`;
      }
    });
  };

  const amarillos = entorno.actividad.tabla.filter(
    (j) => j.color === 'AMARILLO'
  );

  const azules = entorno.actividad.tabla.filter((j) => j.color === 'AZUL');

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

  console.log(entorno);
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
              console.log(row);
              return (
                <>
                  {row.original.color === 'AMARILLO' && (
                    <>
                      {row.original.rowTotal ? (
                        <tr
                          {...row.getRowProps()}
                          style={{
                            backgroundColor: colorPlomo,
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
                      ) : (
                        <>
                          {row.original.jugador === client_id ? (
                            <tr
                              {...row.getRowProps()}
                              style={{
                                backgroundColor: '#ff8700',
                                color: 'black',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: 900,
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
                          ) : (
                            <>
                              {entorno.actividad.resultadosIncluir.incluidos.includes(
                                row.original.jugador
                              ) ? (
                                <tr
                                  {...row.getRowProps()}
                                  style={{
                                    backgroundColor: '#0036ff',
                                    color: 'black',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    fontWeight: 400,
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
                              ) : (
                                <tr
                                  {...row.getRowProps()}
                                  style={{
                                    backgroundColor: colorLightBlue,
                                    color: 'black',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    fontWeight: 400,
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
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {row.original.color === 'AZUL' && (
                    <>
                      {row.original.rowTotal ? (
                        <tr
                          {...row.getRowProps()}
                          style={{
                            backgroundColor: colorPlomo,
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
                      ) : (
                        <>
                          {row.original.jugador === client_id ? (
                            <tr
                              {...row.getRowProps()}
                              style={{
                                backgroundColor: '#ff8700',
                                color: 'black',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: 900,
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
                          ) : (
                            <>
                              {entorno.actividad.resultadosExcluir.excluidos.includes(
                                row.original.jugador
                              ) ? (
                                <tr
                                  {...row.getRowProps()}
                                  style={{
                                    backgroundColor: '#fffb00',
                                    color: 'black',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    fontWeight: 400,
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
                              ) : (
                                <tr
                                  {...row.getRowProps()}
                                  style={{
                                    backgroundColor: colorLightBlue,
                                    color: 'black',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    fontWeight: 400,
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
                            </>
                          )}{' '}
                        </>
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
  senalarJugador(entorno.actividad.tabla);
  return (
    <>
      <Table columns={colsRetirosJugadores} data={azules} />
      <Table columns={colsRetirosJugadores} data={amarillos} />
    </>
  );
};

export default TablaRetiros;
