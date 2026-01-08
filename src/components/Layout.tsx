import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../footer.css';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor">
        <path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.09-.202-.36-1.015.07-2.117 0 0 .67-.215 2.2.82.64-.178 1.32-.266 2-.27.68.004 1.36.092 2 .27 1.52-1.035 2.19-.82 2.19-.82.43 1.102.16 1.915.08 2.117.51.56.82 1.274.82 2.147 0 3.073-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38C13.71 14.53 16 11.53 16 8c0-4.418-3.582-8-8-8" />
    </svg>
);

const LinkedinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor">
        <path d="M13.632 13.635h-2.37V9.922c0-.886-.018-2.025-1.234-2.025-1.235 0-1.424.964-1.424 1.96v3.778h-2.37V6H8.51v1.04h.03c.318-.6 1.092-1.233 2.247-1.233 2.4 0 2.845 1.58 2.845 3.637v4.188zM3.558 4.955c-.762 0-1.376-.617-1.376-1.377 0-.758.614-1.375 1.376-1.375.76 0 1.376.617 1.376 1.375 0 .76-.617 1.377-1.376 1.377zm1.188 8.68H2.37V6h2.376v7.635zM14.816 0H1.18C.528 0 0 .516 0 1.153v13.694C0 15.484.528 16 1.18 16h13.635c.652 0 1.185-.516 1.185-1.153V1.153C16 .516 15.467 0 14.815 0z" />
    </svg>
);

export const Layout: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Simple Header - Only show on post pages, not home */}
            {location.pathname !== '/' && (
                <header className="simple-header">
                    <div className="simple-header-content">
                        <Link to="/" className="home-link">← Back to Posts</Link>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-title">Machine Learning Building Blocks</div>

                    <div className="footer-content">
                        {/* Col 1 */}
                        <div className="footer-col-1">
                            <ul className="list-none">
                                <li>Mike Sole</li>
                            </ul>
                        </div>

                        {/* Col 2 */}
                        <div className="footer-col-2">
                            <ul className="list-none footer-links">
                                <li>
                                    <a href="https://github.com/mike-sole" target="_blank" rel="noopener noreferrer" className="footer-link">
                                        <GithubIcon size={16} className="text-[#828282]" />
                                        <span className="footer-link-text">mike-sole</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/mike-sole" target="_blank" rel="noopener noreferrer" className="footer-link">
                                        <LinkedinIcon size={16} className="text-[#828282]" />
                                        <span className="footer-link-text">mike-sole</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="footer-col-3">
                            <p>
                                A blog about Machine Learning building blocks for developers who aren't mathematicians!
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
