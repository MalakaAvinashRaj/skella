import { Link } from 'react-router-dom'

export  function Navbar() {

    return(
        <div className="nav">
            <Link to="/" className="title"> Title </Link>
            <ul >
                <li>
                    <Link to="/products"> Products </Link>
                </li>
                <li>
                    <Link to="/customers"> Customers </Link>
                </li>
            </ul>
        </div>
    )

}

export default Navbar;