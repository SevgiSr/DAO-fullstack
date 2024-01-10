import styled from "styled-components";
import Proposal from "./Proposal";
import { useContext, useEffect, useState } from "react";
import { ConnectionContext } from "../context/ConnectionContext";
import getEventLogs from "../utils/helpers/getEventLogs";


function Proposals() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const handleStorageChange = async () => {
      setProposals(await getEventLogs().catch(console.error) || []);
    };

    handleStorageChange();

    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, []);

  console.log(proposals)
  return (
    <Styled>
      {proposals?.map((p) => {
        return <Proposal key={p.proposalId} proposal={p} />;
      })}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

export default Proposals;
