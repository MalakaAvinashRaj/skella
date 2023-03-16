import { useState, useEffect } from "react";
import axios from "axios";
import "../pages-css/products.css";
import { NewProductForm } from "./newProductForm";
import { UpdateProductForm } from "./updateProductForm";

export function Products() {
  const [data, setData] = useState(false);
  const [newFormActive, setNewFormActive] = useState(false);
  const [updateFormActive, setUpdateFormActive] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    try {
      axios.get("http://localhost:3500/products").then((response) => {
        if (response.length === 0) {
          return console.log("products not found");
        }
        setData(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!data) return console.log("products not found");

  const deleteProduct = async (event) => {
    setId(event.currentTarget.parentNode.parentNode.id);
    await axios.delete(`http://localhost:3500/products/${id}`);
  };

  const displayNewForm = () => {
    if (updateFormActive) {
      setUpdateFormActive(!updateFormActive);
    }
    setNewFormActive(!newFormActive);
  };

  const displayUpdateForm = (event) => {
    if (newFormActive) {
      setNewFormActive(!newFormActive);
    }
    setUpdateFormActive(true);
    setId(event.currentTarget.parentNode.parentNode.id);
  };

  return (
    <div className="products">
      <h4>Products page</h4>
      {updateFormActive === false ? (
        <button className="buttons update" onClick={displayNewForm}>
          {" "}
          {newFormActive ? " Cancel " : " Add New "}{" "}
        </button>
      ) : (
        <button
          className="buttons update"
          onClick={() => setUpdateFormActive(!updateFormActive)}
        >
          {" "}
          {updateFormActive ? " Cancel " : " Add New "}{" "}
        </button>
      )}

      {newFormActive ? <NewProductForm /> : null}
      {updateFormActive ? <UpdateProductForm id={id} /> : null}

      <div className="products-container">
        {data.map((product) => (
          <div className={"single-product " + product.title} id={product._id}>
            <p className="product-data"> Title: {product.title} </p>
            <p className="product-data"> Descreption: {product.desc} </p>
            <p className="product-data"> Price: {product.price} </p>
            <p className="product-data"> Stock: {product.stock} </p>

            <div className="buttons-div">
              <button className="buttons update" onClick={displayUpdateForm}>
                Update
              </button>
              <button className="buttons delete" onClick={deleteProduct}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
