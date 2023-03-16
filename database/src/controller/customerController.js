const customer = require('../model/customerModel');

const getAllCustomers = async (req, res) => {
    
    const _customers = await customer.find().lean();

    if(!_customers?.length) {
        return res.status(400).json({ message: "Customers not found"})
    }

    console.log(`Fetched data of ${_customers.length} Customers`)
    return res.json(_customers)
}

const getOneCustomer = async (req, res) => {

    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Customer id is required'});

    const _customer = await customer.findById(id).exec();

    if(!_customer) {
        return res.status(400).json({ message: "Customer not found"})
    }

    console.log(`Fetched data of ${_customer.title}.`)
    return res.json(_customer)
}

const newCustomer = async (req, res) => {

    const { wallet, mailid, mobile, address, pincode } = req.body;

    if(!wallet || !mailid || !address || !pincode) return res.status(400).json({ message: 'wallet, mailid, address and pincode are required'});

    const duplicate = await customer.findOne({ wallet }).lean().exec();
    if(duplicate) return res.sendStatus(409).json({ message: `${wallet} is already used`});

    try {
        const result = await customer.create({
            "wallet": wallet,
            "mailid": mailid,
            "mobile": mobile,
            "address": address,
            "pincode": pincode,
        })

        console.log(`New Customer created with wallet: ${result.wallet}`);
        return res.status(201).json({ message : `New Customer created with wallet: ${wallet}`})
    }
    catch(err) {
        return res.status(500).json({ message : err.message });
    }
}

const updateCustomer = async (req, res) => {

    const { id } = req.params;
    const { wallet, mailid, mobile, address, pincode } = req.body;

    if(!wallet || !mailid || !address || !pincode) return res.status(400).json({ message: 'wallet, mailid, address and pincode are required'});

    const _customer = await customer.findById(id).exec();
    const duplicate = await customer.findOne({ wallet }).lean().exec();

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'wallet already used'})
    }

    _customer.wallet = wallet
    _customer.mailid = mailid
    _customer.mobile = mobile
    _customer.address = address
    _customer.pincode = pincode

    const updatedCustomer = await _customer.save();

    console.log(`Updated Customer: ${updatedCustomer.wallet}`)
    res.json({ message: `Updated Customer: ${updatedCustomer.wallet}`})

}

const deleteCustomer = async (req, res) => {

    const { id } = req.params;    

    if(!id) return res.status(400).json({ message: 'Customer id is required'});

    const _customer = await customer.findById(id).exec();
    if(!_customer) {
        return res.status(400).json({ message: 'Customer with id not found'})
    }

    const result = await _customer.deleteOne();

    console.log(`Customer with id: ${id} deleted successfully`)
    res.json({ message: `Customer with id: ${id} deleted successfully`})

}

module.exports = { getAllCustomers, getOneCustomer, newCustomer, updateCustomer, deleteCustomer };