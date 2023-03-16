import { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages-css/customers.css';

export function Customers() {

    const [ data, setData ] = useState(false);

    
    useEffect(() => {
        axios
            .get('http://localhost:3500/customers')
            .then((response) => { setData(response.data);
            });
    },[]);

    if (!data) return null;

    const updateCustomer = () => {

    }

    const deleteCustomer = () => {

    }


    return(
        <div className="customers">
            <h4>Customers page</h4>

            <div className="customers-container">
                {console.log(data)}
                {
                    data.map((customer) =>
                    <div className={"single-customer " + customer.wallet} >
                        <p className='customer-data' >Wallet: {customer.wallet} </p>
                        <p className='customer-data' >Mail Id: {customer.mailid} </p>
                        <p className='customer-data' >Mobile: {customer.mobile} </p>
                        <p className='customer-data' >Address: {customer.address} </p>
                        <p className='customer-data' >Pincode: {customer.pincode} </p>

                        <div className="buttons-div" >
                            <button className="buttons update" onClick={updateCustomer()}>Update</button>
                            <button className="buttons delete" onClick={deleteCustomer()}>Delete</button>
                        </div>
                    </div>
                    )
                }
            </div>
            
        </div>
    );

}

export default Customers;