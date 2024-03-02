import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";

export default function ProductRow({
  product,
  isCart,
  handleIncrement,
  handleDecrement,
  handleLongPress,
}) {
  return (
    <Pressable
      style={styles.container}
      onLongPress={() =>
        isCart &&
        Alert.alert("删除物品", "是否将物品移出购物车", [
          {
            text: "取消",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "确定", onPress: () => handleLongPress(product) },
        ])
      }
      onPress={() => handleIncrement(product)}
    >
      <Image
        source={{ uri: product.src }}
        style={{ width: 110, height: 110 }}
      />
      <View style={{ flex: 6, justifyContent: "center" }}>
        <View style={{ flex: 6, marginTop: 20, marginLeft: 5 }}>
          <Text style={styles.text}>{product.name}</Text>
          <Text style={styles.textStock}>库存：{product.stock}</Text>
        </View>
        <View style={styles.handler}>
          <Text style={[styles.textPrice, { marginRight: 1 }]}>￥</Text>
          <Text style={styles.textPrice}>{product.price}</Text>
          {isCart ? (
            <>
              <Button
                hitSlop={10}
                title="-"
                onPress={() => handleDecrement(product)}
              />
              <Text style={{ fontSize: 16 }}>{product.count}</Text>
              <Button
                hitSlop={10}
                title="+"
                onPress={() => handleIncrement(product)}
              />
            </>
          ) : (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                handleIncrement(product);
              }}
            >
              <Text style={styles.textButton}>加入购物车</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  textStock: {
    fontSize: 12,
    color: "grey",
  },
  textPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 20,
    color: "#3EB489",
    textAlign: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  handler: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#7CD2B3",
    padding: 10,
    borderRadius: 20,
  },
});
