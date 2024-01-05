import styled from "styled-components";
import SideModal from "./SideModal";
import { useContext, useState } from "react";
import { ConnectionContext } from "../context/ConnectionContext";

function Proposals() {
  const proposals = JSON.parse(localStorage.getItem("11155111"));
  const { voteProposal } = useContext(ConnectionContext);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleClick = (id, voteWay) => {
    setIsOpen(false);
    console.log(id, voteWay, reason);
    voteProposal(id, voteWay, reason);
  };

  return (
    <Styled>
      {proposals?.map((p) => {
        return (
          <div className="proposal" key={p.id}>
            <header>Proposal: {p.id.slice(0, 20)}...</header>
            <div className="data-container">
              <div className="data">
                <span className="title">Function To Call:</span>
                <span className="value"> {p.data.functionToCall}</span>
              </div>
              <div className="data">
                <span className="title">Arguments:</span>
                <span className="value"> {p.data.args}</span>
              </div>
            </div>
            <div className="desc">{p.data.description}</div>
            <button className="btn vote-btn" onClick={() => setIsOpen(true)}>
              Vote
            </button>
            <SideModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              content={
                <>
                  <input
                    type="text"
                    onChange={(e) => setReason(e.target.value)}
                    value={reason}
                  />
                  <div className="buttons">
                    <button
                      type="submit"
                      onClick={() => handleClick(p.id, "1")}
                    >
                      For
                    </button>
                    <button
                      type="submit"
                      onClick={() => handleClick(p.id, "0")}
                    >
                      Against
                    </button>
                    <button
                      type="sumbit"
                      onClick={() => handleClick(p.id, "2")}
                    >
                      Abstain
                    </button>
                  </div>
                </>
              }
            />
          </div>
        );
      })}
    </Styled>
  );
}

const Styled = styled.div`
  .proposal {
    width: 400px;
    border: 1px solid var(--border);
    padding: 1.5em 3em;
    margin: 1em;
    header {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 1.3em;
    }
    .data-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1em;
      .data {
        color: var(--font2);
        .title {
          font-size: 16px;
          font-weight: 600;
        }
        .value {
          color: var(--main-text);
        }
      }
    }
    .desc {
      color: var(--font3);
      margin-bottom: 1.5em;
    }
    .vote-btn {
    }
  }
`;

export default Proposals;
