import React, {useState} from 'react';
import styled from "styled-components";
import InfiniteLoader from "react-window-infinite-loader";
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import { FixedSizeList } from 'react-window';
import { useSticky } from 'react-table-sticky';

const Styles = styled.div`
  padding: 1rem;
  width: fit-content;
  display: inline-block;
  max-width: 100%;
  /*overflow: scroll;*/

  .table {
    border: 1px solid #ddd;
    width: fit-content;
    overflow: scroll;
    max-width: 100%;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow: hidden;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        z-index: 4;
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        z-index: 4;
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;

function makeData(amount) {
  const arr = [];
  for (let i = 0; i < amount; i++) {
    arr.push({  id: i+2, name: `User ${i+2}`, age: Math.floor(Math.random()*50+18), email: `User${i+2}@example.com` })
  }
  return arr;
}

const SampleTable = ({ columns, data: initialData }) => {
  const [data, setData] = useState(initialData);
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
    resetResizing
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useBlockLayout,
    useSticky,
    useResizeColumns
  );

  function renderRow({ index, style }) {
    console.log('renderRow');
    console.log(index);
    const row = rows[index];
    if (!row) return <div>Loading...</div>;
    prepareRow(row);
    const { style: rowStyle, ...restRow } = row.getRowProps({ style });
    return (
      <div
      {...restRow}
      style={{ ...rowStyle, width: totalColumnsWidth }}
        className='tr'
      >
        {row.cells.map((cell) => {
          return (
            <div {...cell.getCellProps()} className='td'>
              {cell.render('Cell')}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Styles>
      <button onClick={resetResizing}>Reset Resizing</button>
      <div {...getTableProps()} className='table sticky'>
        <div style={{ position: 'relative', flex: 1, zIndex: 0 }}>
          <InfiniteLoader
              isItemLoaded={(index) => data[index] !== undefined}
              loadMoreItems={async () => {
                setData(data.concat(makeData(40)));
              }}
              itemCount={data.length + 1}
          >
            {({ onItemsRendered, ref }) => {
              return (
                <FixedSizeList
                  height={500}
                  itemCount={data.length + 1}
                  itemSize={29}
                  width='100%'
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  innerElementType={({ children, style, ...rest }) => (
                    <>
                      <div className='header'>
                        <div style={{ width: totalColumnsWidth  }}>
                          {headerGroups.map((headerGroup) => (
                            <div
                              {...headerGroup.getHeaderGroupProps()}
                              className='tr'
                            >
                              {headerGroup.headers.map((column) => (
                                <div
                                  {...column.getHeaderProps()}
                                  className='th'
                                >
                                  {column.render('Header')}
                                  <div
                                    {...column.getResizerProps()}
                                    className={`resizer ${
                                      column.isResizing ? 'isResizing' : ''
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ height: 500 - 58 - 57 }} className='body'>
                        <div {...getTableBodyProps()} {...rest} style={style}>
                          {children}
                        </div>
                      </div>
                    </>
                  )}
              >
                {renderRow}
              </FixedSizeList>
            );
          }}
        </InfiniteLoader>
      </div>
    </div>
  </Styles>
  );
};

export default SampleTable;