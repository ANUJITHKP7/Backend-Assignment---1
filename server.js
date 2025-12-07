
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const loadProducts = () => JSON.parse(fs.readFileSync("./products.json","utf-8"));
const saveProducts = (d) => fs.writeFileSync("./products.json", JSON.stringify(d,null,2));

app.get("/getProducts",(req,res)=>{ res.json(loadProducts()); });

app.post("/addProduct",(req,res)=>{
  const p = loadProducts();
  const {productId, productName, description, Stock} = req.body;
  p.push({productId, productName, description, Stock});
  saveProducts(p);
  res.json({message:"Product added", product:{productId, productName, description, Stock}});
});

app.delete("/deleteProduct",(req,res)=>{
  const p = loadProducts();
  const { productId } = req.body;
  const upd = p.filter(x=>x.productId!==productId);
  saveProducts(upd);
  res.json({message:`Product ${productId} deleted`});
});

app.put("/updateProduct",(req,res)=>{
  const p = loadProducts();
  const { productId } = req.body;
  let found = false;
  const newDesc = "Preferred by Both Vegetarains and Non Vegetarians";
  const upd = p.map(x=>{
    if(x.productId===productId){ x.description=newDesc; found=true; }
    return x;
  });
  saveProducts(upd);
  res.json({message:`Product ${productId} updated`, newDescription:newDesc});
});

app.listen(5000,()=>console.log("Server running on port 5000"));
