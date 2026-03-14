import { createContext, type Dispatch, type SetStateAction } from "react";

export type AuthUser = {
  data: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
};

export type AuthContextValue = {
  user: AuthUser | null;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
});

export default AuthContext;
