import { useContext } from "react";
import styled from "styled-components";
import { ConnectionContext } from "../context/ConnectionContext";
import { FaUser } from "react-icons/fa";

function Home() {
  const { currentAccount, connectWallet, sendProposal, readValue } =
    useContext(ConnectionContext);
  return (
    <StyledHome>
      <nav>
        {currentAccount && (
          <div className="account">
            <div className="icon icon-margin">
              <FaUser />
            </div>
            {currentAccount.slice(0, 5)}...{currentAccount.slice(-5, -1)}
          </div>
        )}
        {!currentAccount && (
          <button onClick={connectWallet} className="btn connect-btn">
            connect wallet
          </button>
        )}
      </nav>

      <div className="actions">
        <div className="propose">
          <button onClick={sendProposal}>Propose 77</button>
        </div>

        <div className="retrieve">
          <button onClick={readValue}>Read Value</button>
        </div>
      </div>
    </StyledHome>
  );
}

const StyledHome = styled.div`
  nav {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.7em 2em;
    color: var(--font2);
    border-bottom: 1px solid var(--border);

    .account {
      font-weight: 600;
      letter-spacing: 1.5px;
    }

    .connect-btn {
      margin-left: auto;
    }
  }

  .actions {
    margin: 500px auto;
  }
`;

export default Home;
