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

const TablaResumenActividad = ({ match, client_id, entorno }) => {
  const actNumero = entorno.actividad.numero;

  const colsRetirosJugadores = React.useMemo(
    () => [
      {
        Header: 'Actividad',
        accessor: 'actividad',
        cellClass: 'w-10',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Pesos Experimentales',
        accessor: 'pesosExperimentales',
        cellClass: 'mw-15',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Tipo de cambio',
        accessor: 'factorConversion',
        cellClass: 'mw-15',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Sus ganancias en Pesos Chilenos',
        accessor: 'pesosChilenos',
        cellClass: 'mw-15',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
    ],
    []
  );

  const arrayFiltrado = entorno.resumen_actividades.filter(
    (element) => element.client_id === client_id && element.actividad !== 0
  );

  const totalActividades = arrayFiltrado.reduce((previous, current) => {
    return previous + current.intPesosChilenos; // sumar el valor de una propiedad
  }, 0);

  function Table({ columns, data, actividad, pagoPresentacion, total }) {
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
              <tr
                {...headerGroup.getHeaderGroupProps()}
                style={{
                  backgroundColor: colorPlomo,
                  color: 'black',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    key={`th_${columnIndex}`}
                    style={{
                      backgroundColor: colorPlomo,
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
                <tr
                  {...row.getRowProps()}
                  style={{
                    backgroundColor: colorPlomo,
                    color: 'black',
                    fontSize: '18px',
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
              );
            })}
            {actividad === 3 && (
              <>
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      backgroundColor: colorPlomo,
                      color: 'black',
                      fontSize: '18px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    PAGO POR PRESENTACIÓN
                  </td>
                  <td
                    colSpan={3}
                    style={{
                      backgroundColor: colorPlomo,
                      color: 'black',
                      fontSize: '18px',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    $ {pagoPresentacion}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      backgroundColor: '#454545',
                      color: 'white',
                      fontSize: '22px',
                      textAlign: 'right',
                      fontWeight: 900,
                    }}
                  >
                    TOTAL
                  </td>
                  <td
                    colSpan={3}
                    style={{
                      backgroundColor: '#454545',
                      color: 'white',
                      fontSize: '22px',
                      textAlign: 'center',
                      fontWeight: 900,
                    }}
                  >
                    $ {pagoPresentacion + total}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      <Table
        columns={colsRetirosJugadores}
        data={arrayFiltrado}
        actividad={actNumero}
        pagoPresentacion={4500}
        total={totalActividades}
      />
      {actNumero !== 3 && (
        <div
          className="text-center h4 mr-4 mt-4 font-weight-bold text-uppercase"
          style={{ paddingTop: '40px' }}
        >
          Tu ganancia total en pesos chilenos hasta esta actividad es{' '}
          {`$ ${totalActividades}`}
        </div>
      )}
      {actNumero === 3 && (
        <div
          className="text-center h4 mr-4 mt-4 font-weight-bold text-uppercase"
          style={{ paddingTop: '40px' }}
        >
          Tu ganancia total en pesos chilenos es{' '}
          {`$ ${totalActividades + 4500}`}
        </div>
      )}
    </>
  );
};

export default TablaResumenActividad;
