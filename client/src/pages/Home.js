import { useContext, useState } from "react";
import styled from "styled-components";
import { ConnectionContext } from "../context/ConnectionContext";
import { Navbar, Proposals } from "../components";
import SideModal from "../components/SideModal";

function Home() {
  const { sendProposal, readValue } = useContext(ConnectionContext);

  return (
    <StyledHome>
      <Navbar />

      <main>
        <Proposals />

        <div className="actions">
          <div className="propose">
            <button onClick={sendProposal}>Propose 77</button>
          </div>

          <div className="retrieve">
            <button onClick={readValue}>Read Value</button>
          </div>
        </div>
      </main>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  main {
    padding: 5em 2em;
    .actions {
      margin: 500px auto;
    }
  }
`;

export default Home;
