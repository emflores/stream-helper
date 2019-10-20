import { AppContextProps } from "../types/types";
import React from "react";

export const AppContext = React.createContext<AppContextProps>({
    socket: null,
});