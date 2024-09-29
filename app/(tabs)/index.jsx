import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";

const index = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View>
      <Text>hello</Text>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <SignedIn>
        <Text>sign in</Text>
      </SignedIn>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
