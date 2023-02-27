import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <div>
      <Header user={user} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const axiosClient = buildClient(appContext.ctx);
  const { data } = await axiosClient.get("/api/users/currentUser");

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log("Data de AppContext!");
  console.log(data);

  console.log("pageProps de AppContext!");
  console.log(pageProps);

  return { pageProps, user: data.user }; // ...data
};

export default AppComponent;
