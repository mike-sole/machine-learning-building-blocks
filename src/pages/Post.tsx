import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { posts } from '../content/posts';
// import type { ContentBlock } from '../content/posts';
import { InteractiveGraph } from '../components/InteractiveGraph';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const post = posts.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return <Navigate to="/" replace />;
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[800px] mx-auto bg-white px-8 md:px-[30px]"
        >
            <header className="mb-8 text-left border-b border-gray-100 pb-8">
                <h1 className="text-4xl md:text-[42px] font-normal text-gray-900 mb-2 leading-tight">
                    {post.title}
                </h1>
                <div className="text-sm text-[#828282]">
                    {post.date}
                </div>
            </header>

            <div className="text-[#202124]">
                <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={{
                        pre: ({ children }) => <>{children}</>,
                        p: ({ node, ...props }) => <p className="mb-4 text-base leading-relaxed" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-2 pl-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="mb-4 pl-8 list-disc [&_ul]:list-[circle] [&_ul]:pl-8" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                        table: ({ node, ...props }) => (
                            <div className="blog-table-container">
                                <table className="blog-table" {...props} />
                            </div>
                        ),
                        code: ({ node, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');

                            // Handle Interactive Graphs
                            if (match && match[1] === 'graph') {
                                const id = String(children).trim();
                                return (
                                    <div className="my-8">
                                        <InteractiveGraph id={id} />
                                    </div>
                                );
                            }

                            const isOutput = match && match[1] === 'text' && String(children).includes('Output\n');
                            const content = isOutput ? String(children).replace('Output\n', '') : String(children);

                            if (!match && !content.includes('\n')) {
                                return (
                                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                        {content}
                                    </code>
                                );
                            }

                            return (
                                <div className={`my-6 rounded-xl ${isOutput ? 'bg-gray-50/50' : ''}`}>
                                    {isOutput && (
                                        <div className="px-4 py-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-white rounded-t-xl">
                                            Output
                                        </div>
                                    )}
                                    <SyntaxHighlighter
                                        language={match ? match[1] : 'text'}
                                        style={oneLight}
                                        showLineNumbers={!isOutput}
                                        customStyle={{
                                            margin: 0,
                                            borderRadius: isOutput ? '0 0 0.75rem 0.75rem' : '0.75rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: isOutput ? 'transparent' : '#f8f9fa',
                                            padding: '1.5rem',
                                            border: '1px solid #eee'
                                        }}
                                    >
                                        {content.replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        }
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-blue-600 font-medium hover:underline">← Back to Posts</Link>
                </div>
            </div>

        </motion.article>
    );
};
