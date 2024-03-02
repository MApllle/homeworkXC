import React from "react";
import { SafeAreaView } from "react-native";
import Product from "../Home/ShowProduct";

export default function CartPage({ products, setProducts }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Product isCart={true} products={products} setProducts={setProducts} />
    </SafeAreaView>
  );
}
