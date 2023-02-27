import { useEffect } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

export default () => {
  const { doRequest } = useRequest({
    url: "https://ticketing.dev/api/users/signOut",
    method: "post",
    body: {},
    onSuccess: () =>
      setTimeout(() => {
        Router.push("/");
      }, 2500),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <h1> Signing you out...</h1>;
};
