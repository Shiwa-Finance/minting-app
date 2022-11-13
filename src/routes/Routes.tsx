import { Routes, Route, useParams, Navigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Home from "../components/Home";

const HomeComponent = () => {
    const { address } = useAccount();
    return (<Home address={address} />);
};

const ViewComponent = () => {
    const { address } = useParams();
    return (<Home address={address as `0x${string}`} />);
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="view/:address" element={<ViewComponent />} />
            <Route path="*" element={<Navigate replace={true} to={"/"} />} />
        </Routes>
    );
};

export default AppRoutes;