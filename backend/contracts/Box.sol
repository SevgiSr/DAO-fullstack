// SPDX-License-Identifier: MIT
// contract that is going to be governed:

pragma solidity ^0.8.18;

// yarn add --dev @openzeppelin/contracts
import "@openzeppelin/contracts/access/Ownable.sol";


contract Box is Ownable{
     uint256 private value;

    // Emitted when the stored value changes
     event ValueChanged(uint256 newValue);

     function store(uint256 newValue) public onlyOwner{
        value = newValue;
        emit ValueChanged(newValue);
     }

     function retrieve() public view returns (uint256){
        return value;
     }
}
