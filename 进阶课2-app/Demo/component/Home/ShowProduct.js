import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import ShowItem from "./ShowItem";

export default function ProductTable({ products, setProducts, isCart }) {
  const total = products.reduce(
    (sum, product) => sum + Number(product.price) * product.count,
    0
  );

  const handleLongPress = (product) => {
    const newProducts = products.map((p) => {
      if (p.id === product.id) {
        return { ...p, count: 0 };
      }
      return p;
    });
    setProducts(newProducts);
  };

  const handleClearCart = () => {
    const newProducts = products.map((p) => {
      p.stock -= p.count;
      p.count = 0;
      if (p.stock < 0) {
        p.stock = 0;
      }
      return p;
    });
    setProducts(newProducts);
  };

  const handleIncrement = (product) => {
    const newProducts = products.map((p) => {
      if (p.id === product.id) {
        return { ...p, count: p.count + 1 > p.stock ? p.stock : p.count + 1 };
      }
      return p;
    });
    setProducts(newProducts);
  };

  const handleDecrement = (product) => {
    const newProducts = products.map((p) => {
      if (p.id === product.id) {
        return { ...p, count: p.count - 1 > 0 ? p.count - 1 : 0 };
      }
      return p;
    });
    setProducts(newProducts);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {products.map((product) => {
          if (product.count === 0 && isCart) return null;
          else
            return (
              <ShowItem
                key={product.id}
                product={product}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                handleLongPress={handleLongPress}
                isCart={isCart}
              />
            );
        })}
      </ScrollView>
      {isCart && (
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text style={styles.sumText}>总价: ￥{total}</Text>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              Alert.alert("结算", "是否结算", [
                {
                  text: "取消",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "确定", onPress: () => handleClearCart() },
              ]);
            }}
          >
            <Text style={styles.textButton}>结算</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    marginTop: 10,
  },
  text: {
    flex: 1,
    fontWeight: "bold",
  },
  sumText: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 20,
    flex: 5,
    color: "#3EB489",
  },
  buttonStyle: {
    marginRight: 10,
    alignItems: "center",
    backgroundColor: "#7CD2B3",
    padding: 10,
    borderRadius: 20,
    flex: 5,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
};
