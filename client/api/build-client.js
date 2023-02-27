import axios from "axios";

export default ({ req }) => {
  try {
    if (typeof window === "undefined") {
      // We are on the server - requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local'

      return axios.create({
        baseURL:
          "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers,
      });
    } else {
      // We are on the browser - requests can be made with a base url of ''
      return axios.create({
        baseURL: "https://ticketing.dev", // '/'
      });
    }
  } catch (error) {
    console.log("Error on buildClient!");
    console.log(error.message);
  }
};
