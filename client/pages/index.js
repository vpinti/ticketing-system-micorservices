import buildClient from "../api/build-client";
import axios from "axios";

const LandingPage = ({ currentUser }) => {
    return currentUser ? (
        <h1>You are signed in</h1>
    ) : (
        <h1>You are NOT signed in</h1>
    );
};

LandingPage.getInitialProps = async context => {
    const client = buildClient(context);

    const { data } = await client.get("/api/users/currentuser").catch(err => {
        console.log(err.message);
    });

    return data;
};

export default LandingPage;
