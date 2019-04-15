import React from "react";
import { render } from "react-dom";
import VirtualList from "react-tiny-virtual-list";
import styled from "styled-components";

const Table = styled.div`
  display: inline-table;
  height: 400px;
`;

const TableHead = styled.div`
  display: table-header-group;
`;

const TableBody = styled.div`
  display: table-row-group;
`;

const TableRow = styled.div`
  display: table-row;
  border-bottom: thin solid rgba(0,0,0,0.25);
`;

const TableCell = styled.div`
  display: table-cell;
  padding: 4px;
`;

const data = [...Array(1000)].map((v, i) => {
  return { x: i, y: Math.random(), z: Math.floor(Math.random()*100)}
});

const App = () => (
  <Table>
    <TableHead />
    <TableBody>
      <VirtualList
        width={300}
        height={'100%'}
        itemCount={data.length}
        itemSize={30}
        overscanCount={15}
        renderItem={({ index, style }) => {
          const { x, y, z } = data[index];
          return (
            <TableRow key={index} style={style}>
              <TableCell>{x}</TableCell>
              <TableCell>{y}</TableCell>
              <TableCell>{z}</TableCell>
            </TableRow>
          )
        }}
      />
    </TableBody>
  </Table>
);

render(<App />, document.getElementById("root"));
