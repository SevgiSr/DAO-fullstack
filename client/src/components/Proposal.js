import { useContext, useEffect, useState } from "react";
import SideModal from "./SideModal";
import styled from "styled-components";
import { ProposalContext } from "../context/ProposalContext";
import { MIN_DELAY } from "../utils/constants.js";
import convertState from "../utils/helpers/convertState.js";

function Proposal({ proposal }) {
  const { voteProposal, getProposalState, executeProposal, queueProposal } =
    useContext(ProposalContext);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [proposalState, setProposalState] = useState("");

  const [proposalExecutionTime, setProposalExecutionTime] = useState(null);
  const [secondsUntilExecution, setSecondsUntilExecution] = useState(null);

  const handleClick = async (voteWay) => {
    setIsOpen(false);
    await voteProposal(proposal.proposalId, voteWay, reason);
  };

  // MIN_DELAY AFTER QUEUE
  // update seconds until execution
  // and execute if proposal execution time is met
  useEffect(() => {
    let interval;

    const execute = async () => {
      await executeProposal(proposal.proposalId);
    };

    if (proposalExecutionTime) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const secondsLeft = Math.max(
          (proposalExecutionTime - currentTime) / 1000,
          0
        );
        setSecondsUntilExecution(secondsLeft);

        if (currentTime >= proposalExecutionTime) {
          execute();
          setProposalExecutionTime(null);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [proposalExecutionTime]);

  // fetch proposal's state
  useEffect(() => {
    const fetchState = async () => {
      const state = await getProposalState(proposal.proposalId);
      setProposalState(convertState(state));
    };
    fetchState();
    const interval = setInterval(fetchState, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <Styled>
      <header>
        <div className="proposal-id">
          Proposal: {proposal.proposalId?.slice(0, 20)}...
        </div>
        <div className="proposal-state">{proposalState}</div>
        <div className="seconds">{secondsUntilExecution}</div>
      </header>
      <div className="data-container">
        <div className="data">
          <span className="title">Function To Call:</span>
          <span className="value"> {proposal.calldatas[0].slice(0,10)}</span>
        </div>
        <div className="data">
          <span className="title">Argument:</span>
          <span className="value"> {parseInt(proposal.calldatas[0].slice(10), 16)}</span>
        </div>
      </div>
      <div className="desc">{proposal.description}</div>
      <div className="buttons">
        <button className="btn vote-btn" onClick={() => setIsOpen(true)}>
          Vote
        </button>
        <div className="queue-and-execute">
          <button
            type="button"
            className="btn btn-main"
            onClick={() => {
              queueProposal(proposal.proposalId);
              setProposalExecutionTime(Date.now() + MIN_DELAY * 1000); // Convert MIN_DELAY to milliseconds
            }}
          >
            Queue
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setProposalExecutionTime(null);
              executeProposal(proposal.proposalId);
            }}
          >
            Execute
          </button>
        </div>
      </div>
      <SideModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={
          <div className="vote-modal-content">
            <header>
              <div className="proposal-id">
                Proposal: {proposal.proposalId?.slice(0, 20)}...
              </div>
              <div className="proposal-state">{proposalState}</div>
            </header>
            <label htmlFor="vote-reason">
              Vote Reason:
              <textarea
                id="vote-reason"
                type="text"
                cols="35"
                rows="8"
                className="input"
                spellCheck="false"
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            </label>
            <div className="vote-buttons">
              <button
                type="submit"
                className="btn btn-green"
                onClick={() => handleClick("1")}
              >
                For
              </button>
              <button
                type="submit"
                className="btn btn-red"
                onClick={() => handleClick("0")}
              >
                Against
              </button>
              <button
                type="sumbit"
                className="btn btn-grey"
                onClick={() => handleClick("2")}
              >
                Abstain
              </button>
            </div>
          </div>
        }
      />
    </Styled>
  );
}

const Styled = styled.div`
  max-width: 600px;
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
      margin-left: 1em;
    }

    .seconds {
      margin-left: 1em;
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
  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .queue-and-execute {
      display: flex;
      align-items: center;
      button {
        margin-left: 1em;
      }
    }
  }

  .vote-modal-content {
    label {
      display: flex;
      flex-direction: column;
      color: var(--font3);
      font-weight: 600;
      margin-bottom: 5em;
      textarea {
        margin-top: 0.5em;
      }
    }
    .vote-buttons {
      button {
        margin-right: 1em;
      }
    }
  }

  @media screen and (max-width: 500px) {
    font-size: 14px;
    padding: 1.2em 2.4em;
    header {
      flex-direction: column;
      align-items: start;
      font-size: 16px;
      .proposal-state {
        margin-top: 0.3em;
      }
    }

    .data-container {
      .data {
        .title {
          font-size: 14px;
        }
      }
    }
    .buttons {
      button {
        font-size: 13px;
      }
      .queue-and-execute {
        button {
          margin-left: 0.3em;
        }
      }
    }
  }
`;

export default Proposal;
