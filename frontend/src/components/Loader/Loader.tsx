import React from "react";
import "./Loader.css";

interface LoaderProps {
    size?: "small" | "medium" | "large";
    overlay?: boolean;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = "medium",
    overlay = false,
    text,
}) => {
    const sizeClass = {
        small: "loader-small",
        medium: "loader-medium",
        large: "loader-large",
    }[size];

    if (overlay) {
        return (
            <div className="loader-overlay">
                <div className="loader-container">
                    <div
                        className={`loader ${sizeClass}`}
                        data-testid="loading-indicator"
                    ></div>
                    {text && <p className="loader-text">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="loader-container">
            <div className={`loader ${sizeClass}`}></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
