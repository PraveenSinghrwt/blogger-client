import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://blogger-server-api.onrender.com/fetchBlogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

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
      <Navbar></Navbar>
      <div className="container mx-auto px-4 pt-4">
        <h1 className="text-3xl font-bold mb-4">All Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog._id} className="border py-4 px-4 rounded-md bg-[#f5f4f4] shadow-md shadow-gray-400 ">
              <div className=' flex justify-center items-center mb-2'>
                <img className='w-full' src={`https://blogger-server-api.onrender.com/Images/${blog.image}`} alt=''></img>
              </div>
              <h2 className=" text-base sm:text-xl font-semibold mb-2">{blog.title}</h2>
              <div className='bg-gray-300 mb-2 h-[0.01rem] w-full'></div>
              <p className=" text-sm sm:text-base mb-4 bg-[#eeebeb] rounded-lg p-2">{blog.content.split(" ").slice(0, 15).join(" ")}...</p>
              <p className=" text-xs sm:text-base text-gray-600 mb-2">Author: <span className='bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-500 sm:text-gray-600 mr-2'>{blog.author}</span></p>
              <p className=" text-xs sm:text-base text-gray-600">Created Date: <span className='bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-500 sm:text-gray-600 mr-2'> {new Date(blog.createdAt).toLocaleDateString()}</span></p>
              <button onClick={() => { navigateToBlog(blog) }} className=" border-2 border-black hover:bg-[#212121] hover:text-white px-4 py-1  rounded-xl mt-4">READ MORE</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blog;
