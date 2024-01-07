import { useContext, useEffect, useState } from "react";
import SideModal from "./SideModal";
import styled from "styled-components";
import { ConnectionContext } from "../context/ConnectionContext";

function Proposal({ proposal }) {
  const { voteProposal, getProposalState, executeProposal, queueProposal } =
    useContext(ConnectionContext);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [proposalState, setProposalState] = useState("");

  const handleClick = (id, voteWay) => {
    setIsOpen(false);
    console.log(id, voteWay, reason);
    voteProposal(id, voteWay, reason);
  };

  const setStateAsString = (state) => {
    switch (Number(state)) {
      case 0:
        setProposalState("pending");
        break;
      case 1:
        setProposalState("active");
        break;
      case 2:
        setProposalState("canceled");
        break;
      case 3:
        setProposalState("defeated");
        break;
      case 4:
        setProposalState("succeeded");
        break;
      case 5:
        setProposalState("Queued");
        break;
      case 6:
        setProposalState("Expired");
        break;
      case 7:
        setProposalState("Executed");
        break;
      default:
        setProposalState("undetected");
        break;
    }
  };

  useEffect(() => {
    const fetchState = async () => {
      const state = await getProposalState(proposal.id);
      setStateAsString(state);
    };
    fetchState();
    const interval = setInterval(fetchState, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <Styled>
      <header>
        <div className="proposal-id">
          Proposal: {proposal.id.slice(0, 20)}...
        </div>
        <div className="proposal-state">{proposalState}</div>
      </header>
      <div className="data-container">
        <div className="data">
          <span className="title">Function To Call:</span>
          <span className="value"> {proposal.data.functionToCall}</span>
        </div>
        <div className="data">
          <span className="title">Arguments:</span>
          <span className="value"> {proposal.data.args}</span>
        </div>
      </div>
      <div className="desc">{proposal.data.description}</div>
      <button className="btn vote-btn" onClick={() => setIsOpen(true)}>
        Vote
      </button>
      <SideModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={
          <>
            <header>
              <div className="proposal-id">
                Proposal: {proposal.id.slice(0, 20)}...
              </div>
              <div className="proposal-state">{proposalState}</div>
            </header>
            <input
              type="text"
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            />
            <div className="buttons">
              <button
                type="submit"
                onClick={() => handleClick(proposal.id, "1")}
              >
                For
              </button>
              <button
                type="submit"
                onClick={() => handleClick(proposal.id, "0")}
              >
                Against
              </button>
              <button
                type="sumbit"
                onClick={() => handleClick(proposal.id, "2")}
              >
                Abstain
              </button>
              <br />
              <button type="button" onClick={() => queueProposal(proposal.id)}>
                Queue
              </button>
              <button
                type="button"
                onClick={() => executeProposal(proposal.id)}
              >
                Execute
              </button>
            </div>
          </>
        }
      />
    </Styled>
  );
}

const Styled = styled.div`
  width: 500px;
  border: 1px solid var(--border);
  padding: 1.5em 3em;
  margin: 1em;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 1.3em;

    .proposal-state {
      color: var(--main-text);
    }
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
`;

export default Proposal;
