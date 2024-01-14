import { Fragment, useContext, useState } from "react";
import styled from "styled-components";
import { ProposalContext } from "../context/ProposalContext";
const biggerBoxAbi = require('../utils/helpers/biggerbox_abi.json');
const boxAbi = require('../utils/helpers/box_abi.json');

function NewProposal() {
  const { sendProposal } = useContext(ProposalContext);
  const [desc, setDesc] = useState("");
  const [selectedContracts, setSelectedContracts] = useState({}); // Holds user-selected contracts and their functions

  const contracts = {
    '0xa73AD35f210D1F97b9691E6163De4986bf902A8b': ['BiggerBox',biggerBoxAbi],
    '0xa35503e5f050F4Fa6B3EE5e74619EaCf2614F96B': ['Box',boxAbi]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let rawCalldatas = {};
    let targets = [];

    // Iterate over selectedContracts and prepare data
    Object.entries(selectedContracts).forEach(([contractAddress, contractData]) => {
      Object.entries(contractData.functions).forEach(([functionName, functionData]) => {
        targets.push(contractAddress);
        rawCalldatas[functionName] = functionData;

      });
    });
    // console.log(targets);
    // console.log(rawCalldatas);

    sendProposal(rawCalldatas, targets, desc);
    // Reset form
  };

  const handleContractCheck = (address, checked) => {
    setSelectedContracts(prev => {
      if (checked) {
        return { ...prev, [address]: { name: contracts[address][0], abi: contracts[address][1], functions: {} } };
      } else {
        const newSelected = { ...prev };
        delete newSelected[address];
        return newSelected;
      }
    });
  };

  const handleFunctionCheck = (contractAddress, functionName, checked, functionInputs) => {
    setSelectedContracts(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[contractAddress].functions[functionName] = {
          arguments: functionInputs.map(input => ({ type: input.type, value: '' }))
        };
      } else {
        delete newSelected[contractAddress].functions[functionName];
      }
      return newSelected;
    });
  };


  const handleArgumentChange = (contractAddress, functionName, argIndex, value) => {
    setSelectedContracts(prev => {
      const newSelected = { ...prev };
      newSelected[contractAddress].functions[functionName].arguments[argIndex].value = value;
      return newSelected;
    });
  };

  const renderFunctionArguments = (contractAddress, functionName) => {
    const functionData = selectedContracts[contractAddress]?.functions[functionName];
    if (!functionData) return null;

    return functionData.arguments.map((arg, index) => (
      <input
        key={index}
        type="text"
        className="input"
        value={arg.value}
        onChange={(e) => handleArgumentChange(contractAddress, functionName, index, e.target.value)}
        placeholder={`Type: ${arg.type}`}
      />
    ));
  };

  const renderFunctionsForContract = (contractAddress) => {
    const contract = contracts[contractAddress];
    return contract[1].filter(item => item.type === 'function' && item.stateMutability !== 'view').map(func => (
      <Fragment key={func.name}>
      <div key={func.name} className="checkbox-container">
        <label>
          {func.name}
        </label>
        <input
          type="checkbox"
          checked={!!selectedContracts[contractAddress]?.functions[func.name]}
          onChange={(e) => handleFunctionCheck(contractAddress, func.name, e.target.checked, func.inputs)}
        />
      </div>
      {renderFunctionArguments(contractAddress, func.name)}
      </Fragment>
    ));
  };

  return (
    <Styled>
      <header>
        <h2>New Proposal</h2>
      </header>
      <div className="actions">
      <div className="propose">
      <form onSubmit={handleSubmit}>
        <div className="contracts">
        {Object.keys(contracts).map(address => (
          <div key={address} className="checkbox-container">
            <label>
              {contracts[address][0]}: {address}
            </label>
              <input
                type="checkbox"
                checked={!!selectedContracts[address]}
                onChange={(e) => handleContractCheck(address, e.target.checked)}
              />
          </div>
        ))}
        </div>
        {Object.keys(selectedContracts).map(contractAddress => (
          <div className="contract-functions" key={contractAddress}>
            <h3>{selectedContracts[contractAddress].name}</h3>
            {renderFunctionsForContract(contractAddress)}
          </div>
        ))}
        <label className="description" htmlFor="desc">
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
        <button type="submit" className="btn btn-main propose-btn">
          Propose
        </button>
      </form>
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

    .contracts {
      margin-bottom: 1em;
    }

    .contract-functions {
      color: var(--font2);
      margin-bottom: 1em;
      h3 {
        margin-bottom: 0.5em;
      }
      .input {
        margin-bottom: 1em;
      }
    }

    .description {
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
