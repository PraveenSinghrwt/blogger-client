import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UserNav from './UserNav';
import Navbar from './Navbar';

import getCookie from '../Functions/getCookie';



export default function User() {

    axios.defaults.withCredentials = true;

    const [user, setUser] = useState([]);
    const [blogs, setBlogs] = useState([]);

    // user blog form states
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile] = useState(null)


    const [showBlogForm, setShowBlogForm] = useState(false); // State variable to manage visibility of the blog form
    const [deleteBlogs, setDeleteBlogs] = useState(false);
    const [isUser, setIsUser] = useState(false);

    const navigate = useNavigate();

    const resetForm = () => {
        setTitle(''); setAuthor(''); setContent(''); setFile(null);
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }
        // console.log('FormData:', formData.get('file'));

        let token = getCookie('jwt'); // Retrieve the token
        // console.log('cookie value is: ', token);
        if (token !== null) {
            try {

                const response = await axios.post('https://blogger-server-api.onrender.com/createBlog', formData, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });

                console.log('Blog created:', response.data);

                alert('Blog Created');
                resetForm();
                fetchBlogs(); // Fetch blogs again after creating a new one
            } catch (error) {
                alert('Error creating blog... Try again');
                console.error('Error creating blog:', error);
            }
        }
    };


    const fetchBlogs = useCallback(async () => {
        let token = getCookie('jwt');
        // console.log('cookie value is: ', token);
        if (token !== null) {
            try {
                const response = await axios.get('https://blogger-server-api.onrender.com/fetchUserBlog', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                if (response.status === 401) {
                    setIsUser(false);
                }
                setIsUser(true);
                setBlogs(response.data.blogs);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching blogs: ", error);
            }
        }
        // eslint-disable-next-line
    }, [navigate]);

    const deleteBlog = async (id) => {
        const isDelete = window.confirm('Do you want to delete this blog...');
        if (isDelete) {
            try {
                await axios.delete(`/deleteBlog/${id}`);
                // console.log(response.data);
                alert('Blog deleted Successfully...');
                setDeleteBlogs(!deleteBlogs);
            }
            catch (error) {
                alert('Error deleting blog.. Try again');
                console.error("Error deleting: ", error);
            }
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, [deleteBlogs, fetchBlogs]); // Fetch blogs only once when component mounts


    const navigateToBlog = (blog) => {
        navigate('/blog', {
            state: {
                title: blog.title,
                content: blog.content,
                author: blog.author,
                image: blog.image,
                createdDate: blog.createdAt
            }
        });
    }

    return (
        <>
            {!isUser ? <div>
                <Navbar />
                <div className="flex flex-col items-center justify-center">
                    <div className="mt-8 text-center">
                        <p className="text-2xl text-gray-700 mb-4">To create blogs, first</p>
                        <div className="flex justify-center">
                            <Link to="/login" className="text-blue-500 underline mr-4 text-lg">Login</Link>
                            <span className="text-gray-500 text-lg">or</span>
                            <Link to="/signup" className="text-blue-500 underline ml-4 text-lg">Signup</Link>
                        </div>
                    </div>
                </div>
            </div> :
                <div>
                    <UserNav username={user.username}></UserNav>
                    <div className=' flex justify-between my-4 mx-2'>
                        <h1 className=" text-md sm:text-lg md:text-xl font-bold mx-4 text-black">
                            Welcome, <span className=' text-xl sm:text-2xl md:text-3xl'> {user.username} </span>
                        </h1>
                        <button className=' text-md text-white font-bold p-1 sm:px-3 sm:py-1 md:py-1 bg-black hover:bg-[#212121] active:bg-[#4b4a4a] rounded-full sm:rounded-md mx-4 h-fit ' onClick={() => setShowBlogForm(true)}><span className='hidden sm:inline'>Create Blog</span>
                            <svg className=' inline md:ml-1'
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg></button>
                    </div>

                    <div className=' bg-white flex flex-col lg:flex-row '>
                        {showBlogForm && ( // Only show the blog form if showBlogForm is true
                            <div className=" p-4 h-fit bg-white text-center flex flex-col md:flex-row gap-4 md:gap-20 lg:w-[60%] xl:w-[45%]">

                                {/* Create Blog Form  */}
                                <div className="relative p-3  sm:p-6 rounded-lg m-1 sm:m-4 shadow-lg md:w-[100%] border-2 shadow-gray-400">
                                    <button onClick={() => setShowBlogForm(false)} className="absolute top-0 right-0 mt-2 mr-2 p-3 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-300">
                                        <svg width="12" height="12" viewBox="0 0 100 100">
                                            <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="2" />
                                            <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="2" />
                                        </svg>
                                    </button>

                                    <h2 className="text-xl font-semibold mb-4 text-black">Create Blog</h2>
                                    <div className="grid grid-cols-1 gap-2 sm:gap-4">
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder="Title" className="bg-[#f3f2f2] w-full px-4 py-2 rounded-lg border border-[#f3f2f2] focus:border-black focus:outline-none" required />
                                        <input value={author} onChange={(e) => setAuthor(e.target.value)} type="text" name="author" placeholder="Author" className="bg-[#f3f2f2] w-full px-4 py-2 rounded-lg border border-[#f3f2f2] focus:border-black focus:outline-none" required />
                                        <textarea value={content} onChange={(e) => setContent(e.target.value)} name="content" rows="4" placeholder="Content" className="bg-[#f3f2f2] w-full px-4 py-2 rounded-lg border border-[#f3f2f2] focus:border-black focus:outline-none" style={{ overflowY: 'auto ' }} required></textarea>

                                        <div className='text-start ml-3'>
                                            <span className='font-semibold '>Blog cover: </span>
                                            <input onChange={handleFileChange} className='' type="file" accept='/image' />
                                        </div>

                                        <button onClick={handleSubmit} className="bg-[#212121] text-white px-4 py-2 rounded-md hover:bg-black focus:outline-none">Create Blog</button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* User's Previous Blogs */}
                        <div className=' p-2 sm:p-4 bg-white flex flex-col lg:flex-row gap-4 md:gap-20 w-[100%]'>
                            <div className=' lg:w-[100%]'>
                                <div className='text-center'>
                                    <h2 className="text-lg m-4 font-semibold text-black bg-gray-300 rounded-lg ">Previous Blogs</h2>
                                </div>
                                {blogs.length === 0 && <div className=' text-center'>Nothing to Show... Create Blogs</div>}
                                <div className="flex  flex-wrap justify-center items-center ">
                                    {blogs.map(blog => (
                                        <div key={blog._id} className="bg-white text-black px-4 sm:px-6 pb-4 pt-4 rounded-lg mb-4 shadow-md shadow-gray-400 w-full mx-4 md:w-80 lg:w-64 xl:w-96 my-3 md:mx-2">
                                            <div className=' flex justify-center items-center mb-2'>
                                                <img className='w-full shadow-sm shadow-gray-400' src={`/Images/${blog.image}`} alt=''></img>
                                            </div>
                                            <h3 className="text-lg font-bold  mb-2">{blog.title}</h3>
                                            <p className="text-gray-700 text-sm">{blog.content.split(" ").slice(0, 10).join(" ")}...</p>

                                            <div className=' flex justify-between mt-4'>
                                                <div className='flex justify-center items-center'>
                                                    <p className="text-gray-400"><span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                                        {new Date(blog.createdAt).getDate()}{" "}
                                                        {new Date(blog.createdAt).toLocaleString('en-US', { month: 'long' })}
                                                    </span></p>
                                                </div>
                                                <div className='flex justify-center items-center'>
                                                    <button onClick={() => { navigateToBlog(blog) }} className='bg-white border-[1px] border-blue-600 px-2 rounded-lg m-2  text-blue-600 hover:bg-blue-600 hover:text-white'>READ</button>
                                                    <button onClick={() => { deleteBlog(blog._id) }}><img className='w-6 h-6 sm:w-7 sm:h-7' src="https://cdn-icons-png.flaticon.com/128/9790/9790368.png" alt="" /></button>
                                                </div>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}