import buildClient from "../api/build-client";

const Landing = ({ user }) => {
  //console.log("I am in the component - browser");

  console.log("Landing Page Component:");
  console.log(user);

  return user ? <h1> You are signed in </h1> : <h1> You are NOT signed in </h1>;
};

// This one is first executed (below) and then this one above
Landing.getInitialProps = async (context) => {
  const axiosClient = buildClient(context);
  const { data } = await axiosClient.get("/api/users/currentUser");

  console.log("Data Landing Page Server");
  console.log(data);

  //data.user.prueba = "prueba";

  return data;
};

export default Landing;
