import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { AppStyles } from "../../../../AppStyles.js";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // List of social objects
  const [socials, setSocials] = useState<SocialModel[]>([]);
  console.log("Rendering Feed Screen")

  const currentUserId = firebase.auth().currentUser!.uid;

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("socials")
      .orderBy("eventDate", "asc")
      .onSnapshot((querySnapshot: any) => {
        var newSocials: SocialModel[] = [];
        querySnapshot.forEach((social: any) => {
          const newSocial = social.data() as SocialModel;
          newSocial.id = social.id;
          newSocials.push(newSocial);
        });
        setSocials(newSocials);
      });
    return unsubscribe;
  }, []);

  const toggleInterested = (social: SocialModel, liked: boolean) => {
    // TODO: Put your logic for flipping the user's "interested"
    // status here, and call this method from your "like"
    // button on each Social card.
    if (liked) {
      console.log("Adding user to likes")
      firebase.firestore()
          .collection("socials")
          .doc(social.id)
          .update({
            likes: firebase.firestore.FieldValue.arrayUnion(currentUserId)
          })
          .catch((error) => {console.log(error)})
      social.likes.push(currentUserId)
    } else {
      console.log("Removing user from likes")
      firebase.firestore()
          .collection("socials")
          .doc(social.id)
          .update({
            likes: firebase.firestore.FieldValue.arrayRemove(currentUserId)
          })
          .catch((error) => {console.log(error)})
      let remove_idx = social.likes.indexOf(currentUserId)
      social.likes.splice(remove_idx, 1)
    }

  };

  const deleteSocial = (social: SocialModel) => {
    // TODO: Put your logic for deleting a social here,
    // and call this method from your "delete" button
    // on each Social card that was created by this user.
    if (social.authorid == currentUserId) {
      firebase.firestore()
        .collection("socials")
        .doc(social.id)
        .delete()
        .then(() => {
          console.log("Doc successfully deleted")
        })
        .catch((error) => {console.log(error)})
    }
    
  };

  const renderSocial = ({ item }: { item: SocialModel }) => {
    
    const onPress = () => {
      navigation.navigate("DetailScreen", {
        social: item,
      });
    };
    //console.log(item.likes)
    //console.log(currentUserId)
    //console.log(item.likes.includes(currentUserId))

    return (
      <Card onPress={onPress} style={{ margin: 16 }}>
        <Card.Cover source={{ uri: item.eventImage }} />
        <Card.Title
          title={item.eventName}
          subtitle={
            item.eventLocation +
            " • " +
            new Date(item.eventDate).toLocaleString() + 
            " • " + 
            item.likes.length + " likes"

          }
        />
        <Card.Actions>
          {item.likes.includes(currentUserId) ? 
            <Button 
              icon="heart"
              onPress={() => {toggleInterested(item, false)}}
            >
              Liked
            </Button> : 
            <Button 
              icon="heart-outline"
              onPress={() => {toggleInterested(item, true)}}
            >
              Like
            </Button>
          }
          
          {item.authorid == currentUserId ? <Button onPress={() => {deleteSocial(item)}}><Text style={{color: "red"}}>Remove</Text></Button> : <Text></Text>}
        </Card.Actions>
        {/* TODO: Add a like/interested button & delete soccial button. See Card.Actions
              in React Native Paper for UI/UX inspiration.
              https://callstack.github.io/react-native-paper/card-actions.html */}
      </Card>
    );
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Socials" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("NewSocialScreen");
          }}
        />
      </Appbar.Header>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <Text style={styles.filler_page}>No socials at this time. Be the first to create one!</Text>
    );
  }

  return (
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={socials}
          renderItem={renderSocial}
          keyExtractor={(_: any, index: number) => "key-" + index}

          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
