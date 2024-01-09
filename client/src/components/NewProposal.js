import { useContext, useState } from "react";
import styled from "styled-components";
import { ProposalContext } from "../context/ProposalContext";

function NewProposal() {
  const { sendProposal, readValue } = useContext(ProposalContext);
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [funcToCall, setFuncToCall] = useState("store");

  const [retrievedValue, setRetrievedValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendProposal(value, funcToCall, desc);
  };

  const handleReadClick = async () => {
    const value = await readValue();
    setRetrievedValue(value);
  };

  return (
    <Styled>
      <header>
        <h2>New Proposal</h2>
      </header>
      <div className="actions">
        <div className="propose">
          <form onSubmit={handleSubmit}>
            <div className="functions">
              <label htmlFor="store">
                Store
                <input
                  id="store"
                  type="radio"
                  value="store"
                  checked={funcToCall === "store"}
                  onChange={(e) => setFuncToCall(e.target.value)}
                />
              </label>
            </div>
            <label htmlFor="value">
              Store number:
              <input
                id="value"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="input"
                spellCheck="false"
              />
            </label>

            <label htmlFor="desc">
              Description:
              <textarea
                id="desc"
                cols="30"
                rows="10"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="input"
                spellCheck="false"
              />
            </label>
            <button type="submit" className="btn btn-main propose-btn">
              Propose
            </button>
          </form>
        </div>

        <div className="retrieve">
          <button onClick={handleReadClick} className="btn read-btn">
            Read Value
          </button>

          <div className="value">{retrievedValue}</div>
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  max-width: 700px;
  header {
    color: var(--font2);
    margin-bottom: 2em;
  }

  .actions {
    .propose {
      form {
        display: flex;
        flex-direction: column;

        label {
          display: flex;
          flex-direction: column;
          margin-bottom: 1em;
          color: var(--font3);
          font-weight: 600;
          input,
          textarea {
            margin-top: 0.5em;
          }
        }

        .functions {
          margin-bottom: 1em;

          label {
            display: flex;
            flex-direction: row-reverse;
            justify-content: start;
            input {
              margin-top: 0;
              margin-right: 1em;
            }
          }
        }
      }
    }

    .retrieve {
      display: flex;
      align-items: center;
      margin-top: 3em;

      .read-btn {
        margin-right: 1em;
      }
      .value {
        font-size: 19px;
        color: var(--font3);
        font-weight: 600;
      }
    }
  }

  @media screen and (max-width: 900px) {
    margin-bottom: 3em;
  }
`;

export default NewProposal;
