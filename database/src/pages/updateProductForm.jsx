import React, { useState, useEffect } from "react";
import "../pages-css/product-form.css";
import axios from "axios";

export function UpdateProductForm(props) {
  const [id, setId] = useState("");
  const [result, setResult] = useState(false);

  useEffect(() => {
    setId(props.id);
  }, [props.id]);

  const [input, setInput] = useState({
    title: "",
    desc: "",
    price: "",
    stock: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  const addingProduct = async () => {
    const _product = {
      title: input.title,
      desc: input.desc,
      price: input.price,
      stock: input.stock,
    };

    await axios
      .patch(`http://localhost:3500/products/${id}`, _product)
      .then(setResult(true));
  };

  return (
    <div className="form-container">
      {result === false ? (
        <div className="form-div">
          <div className="form-element">
            <p className="form-element-lable title">Title </p>
            <input
              className="form-element-input box title"
              name="title"
              value={input.title}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="form-element">
            <p className="form-element-lable desc">Descreption </p>
            <input
              className="form-element-input box desc"
              name="desc"
              value={input.desc}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="form-element">
            <p className="form-element-lable price">price </p>
            <input
              className="form-element-input box price"
              name="price"
              value={input.price}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="form-element">
            <p className="form-element-lable stock">stock </p>
            <input
              className="form-element-input box stock"
              name="stock"
              value={input.stock}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="form-element buttons-div">
            <button
              className="form-element-button buttons"
              onClick={addingProduct}
            >
              Update Product
            </button>
          </div>
        </div>
      ) : null}
      <div className="result-div">
        {result ? "Product Updated Successfully" : "Product Updating Failed"}
      </div>
    </div>
  );
}

export default UpdateProductForm;
