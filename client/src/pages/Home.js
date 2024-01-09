import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ConnectionContext } from "../context/ConnectionContext";
import { Navbar, NewProposal, Proposals } from "../components";
import SideModal from "../components/SideModal";
import { ProposalContext } from "../context/ProposalContext";

function Home() {
  return (
    <StyledHome>
      <Navbar />

      <main>
        <NewProposal />
        <Proposals />
      </main>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  main {
    display: flex;
    justify-content: space-around;
    padding: 5em 2em;
  }

  @media screen and (max-width: 900px) {
    main {
      flex-direction: column;
    }
  }
`;

export default Home;
