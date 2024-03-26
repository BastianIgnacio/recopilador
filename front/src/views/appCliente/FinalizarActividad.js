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
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Label,
  Row,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import { colorLightBlue, colorPlomo } from 'constants/defaultValues';

const FinalizarActividad = ({ match, idWs, resultadoJugadores }) => {
  // NECESITAMOS EL RESUMEN DE GANANCIAS POR RONDAS
  // MOSTRAR LA CANTIDAD DE PESOS EXPERIMENTALES OBTENIDOS POR RONDA Y EN TOTAL
  // HACER LA MULTIPLICACION DEL DINERO

  console.log(resultadoJugadores);
  const colsRetirosJugadores = React.useMemo(
    () => [
      {
        Header: 'Actividad',
        accessor: 'actividad',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Pesos Experimentales',
        accessor: 'pesosExperimentales',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Factor Conversion',
        accessor: 'valorPesoExperimental',
        cellClass: 'w-5',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Pesos',
        accessor: 'pesos',
        cellClass: 'w-5',
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
                  {row.original.rowTotal ? (
                    <tr
                      {...row.getRowProps()}
                      style={{
                        backgroundColor: colorLightBlue,
                        color: 'black',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: 800,
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
      <Row className="d-flex justify-content-center">
        <Colxx xl="4">
          <Card>
            <CardTitle className="text-center mt-3 font-weight-bold">
              Ha finalizado la actividad
            </CardTitle>
            <CardBody>
              <Table columns={colsRetirosJugadores} data={resultadoJugadores} />
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default FinalizarActividad;
