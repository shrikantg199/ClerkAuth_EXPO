import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View, Alert } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Unified authentication handler
  const handleAuthentication = React.useCallback(async (sessionId) => {
    try {
      await setActive({ session: sessionId });
      router.push("/");
    } catch (error) {
      console.error("Error setting active session:", error);
      Alert.alert("Authentication Error", "Failed to complete sign-in process.");
    }
  }, [setActive, router]);

  // OAuth Google sign-in flow
  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onGoogleSignInPress = React.useCallback(async () => {
    try {
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/", { scheme: "myapp" }),
      });
      if (createdSessionId) {
        await handleAuthentication(createdSessionId);
      } else {
        console.log("No session created, additional steps may be required");
      
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("Google Sign-In Error", err.message || "An error occurred during Google Sign-in.");
    }
  }, [handleAuthentication]);

  // Email and password sign-in flow
  const onEmailSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await handleAuthentication(signInAttempt.createdSessionId);
      } else {
        console.log("Sign-in not complete, status:", signInAttempt.status);
        Alert.alert("Sign-In Error", "Sign-in requires further steps.");
        // Handle additional steps if necessary
      }
    } catch (err) {
      console.error("Email sign-in error", err);
      Alert.alert("Sign-In Error", err.message || "An error occurred during sign-in.");
    }
  }, [isLoaded, emailAddress, password, handleAuthentication]);

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={setEmailAddress}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="Sign In with Email" onPress={onEmailSignInPress} />
      <Link href="/sign-up">
        <Text>Sign up</Text>
      </Link>
      <View>
        <Button title="Sign in with Google" onPress={onGoogleSignInPress} />
      </View>
    </View>
  );
}