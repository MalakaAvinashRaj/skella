const customer = require('../model/customerModel');

const getAllCustomers = async (req, res) => {c
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

    const { title, desc, price, stock } = req.body;

    if(!title || !desc || !price) return res.status(400).json({ message: 'title, Descreption and price are required'});

    const duplicate = await customer.findOne({ title }).lean().exec();
    if(duplicate) return res.sendStatus(409).json({ message: `${title} is already used`});

    try {
        const result = await customer.create({
            "title": title,
            "desc": desc,
            "price": price,
            "stock": stock,
        })

        console.log(`New Customer created with id: ${result._id}`);
        return res.status(201).json({ message : `New Customer ${title} created`})
    }
    catch(err) {
        return res.status(500).json({ message : err.message });
    }
}

const updateCustomer = async (req, res) => {

    const { id } = req.params;
    const { title, desc, price, stock } = req.body;

    if(!title || !desc || !price) return res.status(400).json({ message: 'title, Descreption and price are required'});

    const _customer = await customer.findById(id).exec();
    const duplicate = await customer.findOne({ title }).lean().exec();

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Title already used'})
    }

    _customer.title = title
    _customer.desc = desc
    _customer.price = price
    _customer.stock = stock

    const updatedCustomer = await _customer.save();

    console.log(`Customer: ${updatedCustomer.title} updated`)
    res.json({ message: `Customer: ${updatedCustomer.title} updated`})

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