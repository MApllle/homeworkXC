import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import CartPage from "./component/Cart";
import HomePage from "./component/Home";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Data from "./component/DataList.json";

//const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RequestStatus = {
  IDLE: "IDLE",
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
};

export default function App() {
  const [products, setProducts] = React.useState([]);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.IDLE);
  const forkFetch = () => {
    return new Promise((resolve) => {
      const data = Data;
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  };

  useEffect(() => {
    setRequestStatus(RequestStatus.PENDING);
    forkFetch()
      .then((products) => {
        setProducts(products);
        setRequestStatus(RequestStatus.SUCCESS);
      })
      .catch(() => {
        setRequestStatus(RequestStatus.ERROR);
      });
  }, []);

  if (requestStatus === RequestStatus.PENDING) {
    return <Text>Loading...</Text>;
  }

  if (requestStatus === RequestStatus.ERROR) {
    return <Text>Error</Text>;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#7CD2B3",
        }}
      >
        <Tab.Screen
          name="商品列表"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="teddy-bear"
                size={size}
                color={color}
              />
            ),
          }}
        >
          {(props) => (
            <HomePage
              {...props}
              products={products}
              setProducts={setProducts}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="购物车"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cart-outline"
                size={size}
                color={color}
              />
            ),
          }}
        >
          {(props) => (
            <CartPage
              {...props}
              products={products}
              setProducts={setProducts}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
