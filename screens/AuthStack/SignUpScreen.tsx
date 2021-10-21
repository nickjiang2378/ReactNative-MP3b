import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";

import { AppStyles } from "../../AppStyles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */
  const [email, setEmail] = useState<String>("")
  const [password, setPassword] = useState<String>("")
  const [errorMessage, setErrorMessage] = useState<String>("")
  const [errorVisible, setErrorVisible] = useState<Boolean>(false)

  function createUser(email: String, password: String) {
    if (validateFields(email, password)) {
      console.log("Attempting to login")
      let auth = firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var error = error.message;
        console.log(error)
        if (errorCode == "auth/email-already-in-use") {
          showError(error)
        }
        else if (errorCode == "auth/invalid-email") {
          showError("Please enter a valid email address")
        }
        else if (errorCode == "auth/weak-password") {
          showError("Please enter a stronger password")
        }
      });
    }
    else {
      console.log("Fields invalid")
    }
  }

  function showError(mes: String) {
    setErrorVisible(true)
    setErrorMessage(mes)
  }

  function validateFields(email: String, password: String) {
    if (!email) {
      setErrorMessage("The email field is required")
      setErrorVisible(true)
    }
    else if (!password || password.length < 6) {
      setErrorMessage("A password at least six characters long is required")
      setErrorVisible(true)
    }
    else {
      return true
    }
  }
  
  return (
    <>
      <SafeAreaView style={AppStyles.container}>

        <View>
          <View style={{"padding": 20, "marginBottom": 20}}>
            <TextInput 
              label="Email"
              value={email}
              style={AppStyles.text_input}
              onChangeText={text => setEmail(text)}
            />
            <TextInput 
              label="Password"
              value={password}
              style={AppStyles.text_input}
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
            />
            <View style={{"marginTop": 20}}>
              <Button
                mode="contained"
                style={AppStyles.button}
                onPress={() => {console.log("Signing up user"); createUser(email, password)}}
              >
                Create an account
              </Button>
              <Button
                style={AppStyles.button}
                onPress={() => {navigation.navigate("SignInScreen")}}
              >
                Or, sign in instead
              </Button>
            </View>
          </View>
          <View style={{"margin": 10}}>
            <Snackbar
              visible={errorVisible}
              duration={700}
            >
              {errorMessage}
            </Snackbar>
          </View>
            
          

        </View>
      </SafeAreaView>
    </>
  );
}

