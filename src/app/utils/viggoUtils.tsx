import Environment from "./env";
import { prefferedAxios } from "../types/fetch";
import { AxiosError } from "axios";
import { Konstanter } from "./consts";

export const erViggo = () => {
  prefferedAxios
    .get(Environment().apiUrl + Konstanter.erViggo, {
      withCredentials: true,
    })
    .catch((reason: AxiosError) => {
      if (reason.response!.status === 307) {
        // Bruker er Viggo. Sende til den nye løsningen
        window.location.assign(`${Environment().nyLoesningUrl}`);
      } else if (reason.response!.status === 401) {
        // Bruker er ikke innlogget, sender ham til innogging
        window.location.assign(`${Environment().loginUrl}`);
      }
      console.log(reason.message);
    });
};
