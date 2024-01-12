import { useContext, useState } from "react";
import styled from "styled-components";
import { ProposalContext } from "../context/ProposalContext";

function NewProposal() {
  const { sendProposal, readIntValue, readStrValue } = useContext(ProposalContext);
  const [intValue, setIntValue] = useState("");
  const [strValue, setStrValue] = useState("");
  const [desc, setDesc] = useState("");
  const [storeIntChecked, setStoreIntChecked] = useState(false);
  const [storeStrChecked, setStoreStrChecked] = useState(false);
  const [retrievedIntValue, setRetrievedIntValue] = useState("");
  const [retrievedStrValue, setRetrievedStrValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let rawCalldatas = {};
    setError(""); // Reset error message

    if (storeIntChecked) {
      if (isNaN(Number(intValue))) {
        setError("Input is not a number");
        return;
      }
      rawCalldatas.store_int = [Number(intValue)];
    }
    if (storeStrChecked) {
      rawCalldatas.store_str = [strValue];
    }

    // Check if at least one function is selected
    if (!storeIntChecked && !storeStrChecked) {
      setError("Please select at least one function to store");
      return;
    }

    console.log(rawCalldatas);
    sendProposal(rawCalldatas, desc);

    // Reset form
    setIntValue("");
    setStrValue("");
    setDesc("");
    setStoreIntChecked(false);
    setStoreStrChecked(false);
  };

  const handleReadIntClick = async () => {
    const value = await readIntValue();
    setRetrievedIntValue(value);
  };

  const handleReadStrClick = async () => {
    const value = await readStrValue();
    setRetrievedStrValue(value);
  };

  return (
    <Styled>
      <header>
        <h2>New Proposal</h2>
      </header>
      <div className="actions">
        <div className="propose">
        <form onSubmit={handleSubmit}>
          {/* Checkbox for Store Int */}
          <div className="checkbox-container">
            <label className="checkbox-label" htmlFor="storeIntCheckbox">
              store_int
            </label>
            <input
              id="storeIntCheckbox"
              type="checkbox"
              checked={storeIntChecked}
              onChange={() => setStoreIntChecked(!storeIntChecked)}
            />
          </div>
          {/* Input for Int value, shown only if storeIntChecked is true */}
          {storeIntChecked && (
            <label htmlFor="value">
              <input
                id="intValue"
                type="text"
                value={intValue}
                onChange={(e) => setIntValue(e.target.value)}
                className="input"
                spellCheck="false"
                placeholder="Type: uint256"
              />
            </label>
          )}

          {/* Checkbox for Store Str */}
          <div className="checkbox-container">
            <label className="checkbox-label" htmlFor="storeStrCheckbox">
              store_str
            </label>
            <input
              id="storeStrCheckbox"
              type="checkbox"
              checked={storeStrChecked}
              onChange={() => setStoreStrChecked(!storeStrChecked)}
            />
          </div>

          {/* Input for Str value, shown only if storeStrChecked is true */}
          {storeStrChecked && (
            <label htmlFor="strValue">
              <input
                id="strValue"
                type="text"
                value={strValue}
                onChange={(e) => setStrValue(e.target.value)}
                className="input"
                spellCheck="false"
                placeholder="Type: string"
              />
            </label>
          )}

            <label className="description-label" htmlFor="desc">
              Description:
              <textarea
                id="desc"
                cols="30"
                rows="10"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="input"
                spellCheck="false"
                placeholder="Describe your proposal."
              />
            </label>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-main propose-btn">
              Propose
            </button>
          </form>
        </div>

        <div className="retrieve">
          <button onClick={handleReadIntClick} className="btn read-btn">
            Read Int
          </button>
          <div className="value">{retrievedIntValue}</div>
        </div>
        <div className="retrieve">
          <button onClick={handleReadStrClick} className="btn read-btn">
            Read Str
          </button>
          <div className="value">{retrievedStrValue}</div>
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
          color: var(--font3);
          font-weight: 600;
          input,
          textarea {
            margin-bottom: 1em;

          }
        }
        .checkbox-container {
          display: flex;
          flex-direction: row-reverse;
          justify-content: start;
          align-items: center;
          margin-bottom: 1em;
        }
        .checkbox-label {
          padding-left: 1em;
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

    .description-label {
      textarea {
        margin-top: 1em;
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
