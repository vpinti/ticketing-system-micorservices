import { useState } from "react";
import useRequest from "../../hooks/use-request";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
            email,
            password,
        },
    });

    const onSubmit = event => {
        event.preventDefault();
        doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    className="form-control"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};

export default Signup;
