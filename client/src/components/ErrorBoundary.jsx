// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-red-600 dark:text-red-400">
                    <h2 className="text-xl font-semibold">Something went wrong.</h2>
                    <p className="mt-2">Please try refreshing the page or contact support.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;