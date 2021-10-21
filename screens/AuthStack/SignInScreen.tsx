import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";
import { AppStyles } from "../../AppStyles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */

  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [errorMessage, setErrorMessage] = useState<String>("");
  const [errorVisible, setErrorVisible] = useState<Boolean>(false);
  const [loadingVisible, setLoadingVisible] = useState<Boolean>(false);

  function loginUser(email: String, password: String) {
    if (validateFields(email, password)) {
      setLoadingVisible(true)
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        setLoadingVisible(false)
        console.log("Successfully signed in")
        var user = userCredential.user;
      })
      .catch((error) => {
        setLoadingVisible(false)
        var errorCode = error.code;
        var error = error.message;
        console.log(error)
        if (errorCode == "auth/user-not-found" || errorCode == "auth/wrong-password") {
          showError("Email/Password credentials are invalid");
        }
        console.log(errorCode);
      });
    }
    else {
      console.log("Validation failed")
    }

  }

  function resetPassword(email: String) {
    if (!email) {
      showError("Please enter a valid email address.")
    }
    else {
      firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        console.log("Reset password email sent!")
        showError("Reset password email sent!")
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        console.log(errorCode)
        if (errorCode == "auth/invalid-email") {
          showError("Please enter a valid email address.")
        }
      });
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
    else if (!password) {
      setErrorMessage("The password field is required")
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
          style={AppStyles.text_input}
          value={email}
          onChangeText={text => setEmail(text)}
          />
          <TextInput 
            label="Password"
            style={AppStyles.text_input}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />
          <Button
            mode="contained"
            style={AppStyles.button}
            loading={loadingVisible}
            onPress={() => {console.log("Signing in user"); loginUser(email, password)}}
          >
            Sign In
          </Button>
          <Button
            style={AppStyles.button}
            onPress={() => {navigation.navigate("SignUpScreen")}}
          >
            Or, sign up instead
          </Button> 
          <Button
            style={AppStyles.button}
            onPress={() => {console.log("Resetting password"); resetPassword(email)}}
          >
            <Text style={AppStyles.faded_button}>Reset Password</Text>
          </Button> 
          </View>
        </View>
        <View style={{"margin": 10}}>
          <Snackbar
            visible={errorVisible}
          >
            {errorMessage}
          </Snackbar>
        </View>
        
      </SafeAreaView>
    </>
  );
}
