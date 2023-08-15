import React from 'react';
import SampleTable from './SampleTable';

function makeData(amount) {
  const arr = [];
  for (let i = 0; i < amount; i++) {
    arr.push({  id: i+2, name: `User ${i+2}`, age: Math.floor(Math.random()*50+18), email: `User${i+2}@example.com` })
  }
  return arr;
}

const App = () => {

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        /*maxWidth: 70,
        minWidth: 50,
        width: 60,*/
      },
      {
        Header: 'Name',
        accessor: 'name',
        /*maxWidth: 400,
        minWidth: 140,
        width: 200,*/
      },
      {
        Header: 'Age',
        accessor: 'age',
        /*maxWidth: 70,
        minWidth: 50,
        width: 60,*/
      },
      {
        Header: 'Email',
        accessor: 'email',
        /*maxWidth: 400,
        minWidth: 140,
        width: 200,*/
      },
    ],
    []
  );

  return (
    <div className="App">
      <h1>Sample Table using react-table and react-window</h1>
      <SampleTable columns={columns} data={makeData(40)} />
    </div>
  );
};

export default App;
