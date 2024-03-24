import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./HomePage";
import DetailPage from "./DetailPage";
import Authentication from "./Authentication";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authentication">
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DetailPage" component={DetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
