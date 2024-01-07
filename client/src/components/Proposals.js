import styled from "styled-components";
import Proposal from "./Proposal";
import { useContext, useEffect, useState } from "react";
import { ConnectionContext } from "../context/ConnectionContext";

function Proposals() {
  const proposals = JSON.parse(localStorage.getItem("11155111"));

  console.log(proposals);

  return (
    <Styled>
      {proposals?.map((p) => {
        return <Proposal key={p.id} proposal={p} />;
      })}
    </Styled>
  );
}

const Styled = styled.div``;

export default Proposals;
