// SPDX-License-Identifier: MIT
// contract that is going to be governed:

pragma solidity ^0.8.18;

// yarn add --dev @openzeppelin/contracts
import "@openzeppelin/contracts/access/Ownable.sol";


contract BiggerBox is Ownable{
     uint256 private intValue;
     string private strValue;

    // Emitted when the stored value changes
     event intValueChanged(uint256 newInt);

     function store_int(uint256 newInt) public onlyOwner{
        intValue = newInt;
        emit intValueChanged(newInt);
     }

     function retrieve_int() public view returns (uint256){
        return intValue;
     }

     event strValueChanged(string newStr);

     function store_str(string memory newStr) public onlyOwner{
      strValue = newStr;
      emit strValueChanged(newStr);
     }

     function retrieve_str() public view returns (string memory){
      return strValue;
     }
}
