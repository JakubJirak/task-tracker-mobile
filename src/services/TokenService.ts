let token: string | null = null;
import * as SecureStore from "expo-secure-store";

export async function setToken(newToken: string) {
  token = newToken;

  if (token !== null) {
    await SecureStore.setItemAsync("authToken", token);
  } else {
    await SecureStore.deleteItemAsync("authToken");
  }
}

export async function getToken() {
  if (token !== null) {
    return token;
  }

  token = await SecureStore.getItemAsync("authToken");
  return token;
}
