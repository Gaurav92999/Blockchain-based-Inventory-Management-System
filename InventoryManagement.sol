pragma solidity ^0.8.0;

contract InventoryManagement {
    
    struct Item {
        uint id;
        string name;
        uint quantity;
        bool isAvailable;
    }
    
    mapping(uint => Item) public items;
    uint public itemsCount;
    address public owner;
    
    event ItemAdded(uint id, string name, uint quantity);
    event ItemQuantityChanged(uint id, uint quantity);
    event ItemAvailabilityChanged(uint id, bool isAvailable);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function addItem(uint _id, string memory _name, uint _quantity) public onlyOwner {
        require(_id > 0 && bytes(_name).length > 0 && _quantity > 0);
        require(items[_id].id != _id);
        
        items[_id] = Item(_id, _name, _quantity, true);
        itemsCount++;
        
        emit ItemAdded(_id, _name, _quantity);
    }
    
    function changeItemQuantity(uint _id, uint _quantity) public onlyOwner {
        require(_id > 0 && _quantity > 0);
        require(items[_id].id == _id);
        
        items[_id].quantity = _quantity;
        
        emit ItemQuantityChanged(_id, _quantity);
    }
    
    function changeItemAvailability(uint _id, bool _isAvailable) public onlyOwner {
        require(_id > 0);
        require(items[_id].id == _id);
        
        items[_id].isAvailable = _isAvailable;
        
        emit ItemAvailabilityChanged(_id, _isAvailable);
    }
    
    function viewItem(uint _id) public view returns (Item memory) {
        require(_id > 0 && items[_id].id == _id);
        
        return items[_id];
    }
}
