import React from "react";
import SurajPrintingLoader from "./loader";

const LazyFallback = ({ title = "Loading Page...", subtitle = "Please wait..." }) => {
    return <SurajPrintingLoader title={title} subtitle={subtitle} />;
};

export default LazyFallback;
