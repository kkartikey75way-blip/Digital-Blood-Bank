import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans text-center">
                    <h2 className="mb-4 text-2xl font-bold text-red-600">
                        Oops, something went wrong.
                    </h2>
                    <p className="mb-6 text-gray-600">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-red-700 shadow-sm"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
