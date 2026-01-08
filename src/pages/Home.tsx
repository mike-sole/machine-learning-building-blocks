import React from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../content/posts';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                    Machine Learning Building Blocks
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto space-y-4"
                >
                    <p className="text-xl text-gray-600">
                        A blog about Machine Learning building blocks for developers who aren’t mathematicians!
                    </p>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Each blog post will be short and act as a pre-requisite for subsequent posts. Starting with weighted sums to build the foundations for explaining the workings of neural networks and beyond.
                    </p>
                </motion.div>
            </div>

            <div className="post-list">
                {[...posts].reverse().map((post, index) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="post-card group"
                    >
                        <div className="post-card-container">
                            {post.thumbnail && (
                                <div className="post-thumbnail-container">
                                    <Link to={`/post/${post.id}`}>
                                        <img
                                            src={post.thumbnail.startsWith('/') ? import.meta.env.BASE_URL + post.thumbnail.slice(1) : post.thumbnail}
                                            alt={post.title}
                                            className="post-thumbnail"
                                        />
                                    </Link>
                                </div>
                            )}
                            <div className="post-content">
                                <h2 className="post-title">
                                    <Link to={`/post/${post.id}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="post-description">
                                    {post.description}
                                </p>

                                <div className="post-card-footer">
                                    <Link
                                        to={`/post/${post.id}`}
                                        className="read-more"
                                    >
                                        Read Article <ArrowRight size={16} className="arrow-icon" />
                                    </Link>

                                    <span className="post-card-date">
                                        {post.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
};
