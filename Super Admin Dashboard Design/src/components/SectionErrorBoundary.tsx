import { Component, type ErrorInfo, type ReactNode } from "react";

interface SectionErrorBoundaryProps {
  sectionName: string;
  children: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  state: SectionErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Section render error", { section: this.props.sectionName, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center bg-[#f5f6f8] p-6">
          <div className="bg-white border border-[#e8eaed] rounded p-5 max-w-md w-full text-center">
            <h2 className="text-[#1f2937] mb-2">Section Failed to Load</h2>
            <p className="text-[13px] text-[#6b7280] mb-4">
              Something went wrong while loading {this.props.sectionName}. Please refresh or switch sections.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
