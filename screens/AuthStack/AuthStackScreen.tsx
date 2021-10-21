import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import { COLOR_PRIMARY } from "../../AppStyles";

export type AuthStackParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export function AuthStackScreen() {
  const options = { 
    headerStyle: {
      backgroundColor: COLOR_PRIMARY
    },
    headerTintColor: "white",
    headerTitleStyle: {
      fontWeight: "normal"
    },
    headerLeft: null
  };
  return (
    <AuthStack.Navigator initialRouteName="SignInScreen" screenOptions={options}>
      <AuthStack.Screen
        name="SignInScreen"
        options={{"title": "Sign In"}}
        component={SignInScreen}
      />
      <AuthStack.Screen
        name="SignUpScreen"
        options={{"title": "Sign Up"}}
        component={SignUpScreen}
      />
    </AuthStack.Navigator>
  );
}
