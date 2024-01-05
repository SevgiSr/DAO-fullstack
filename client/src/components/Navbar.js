import { useContext } from "react";
import styled from "styled-components";
import { ConnectionContext } from "../context/ConnectionContext";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { currentAccount, connectWallet } = useContext(ConnectionContext);
  return (
    <Styled>
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
    </Styled>
  );
}

const Styled = styled.nav`
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.7em 2em;
  color: var(--font2);
  background-color: var(--background1);
  border-bottom: 1px solid var(--border);

  .account {
    font-weight: 600;
    letter-spacing: 1.5px;
  }

  .connect-btn {
    margin-left: auto;
  }
`;

export default Navbar;
