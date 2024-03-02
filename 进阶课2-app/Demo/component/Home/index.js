import React from "react";
import { SafeAreaView } from "react-native";
import ShowProduct from "./ShowProduct";

export default function HomePage({ products, setProducts }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ShowProduct
        isCart={false}
        products={products}
        setProducts={setProducts}
      />
    </SafeAreaView>
  );
}
