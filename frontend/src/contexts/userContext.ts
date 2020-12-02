import { createContext } from 'react';
import { USERNAME } from "../api/auth";

type ContextProps = {
  user: null | string;
  setUser: any;
};

const userContext = createContext<ContextProps>({user: null, setUser: ()=>{}});

export default userContext;

