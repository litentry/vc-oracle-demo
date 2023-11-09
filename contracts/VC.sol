// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract VC {
    // uint256 VC id => VC property => content
    mapping(uint256 => mapping (bytes32 => bytes)) public VCRegistry;
    bytes32[] public _properties;
    function setVCProperty(uint256 id, bytes32 property, bytes memory content) public {
        VCRegistry[id][property] = content;
    }
     function setVCPropertyString(uint256 id, bytes32 property, string memory content) public {
        VCRegistry[id][property] = abi.encodePacked(content);
    }

    // Please notice remove/alter property list items will not change the existing property storage
    function setProperties(bytes32[] calldata _propertyList) public {
        _properties = _propertyList;
    }
    function getVC(uint256 id) public view returns (string memory) {
        bytes memory temp = abi.encodePacked("{");
        for (uint256 i = 0; i < _properties.length; ++i) {
            temp = abi.encodePacked(temp, _properties[i], ":", VCRegistry[id][_properties[i]], ",");
        }
        temp = abi.encodePacked(temp, "}");
        return string(temp);
    }
}
