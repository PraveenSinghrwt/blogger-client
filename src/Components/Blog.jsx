import React from 'react';
import { useLocation } from 'react-router-dom';
import UserNav from './UserNav';

const Blog = () => {
    const location = useLocation();
    const { title, author, content, image, createdDate } = location.state;

    return (
        <>
            <UserNav username={author}></UserNav>
            <div className=" bg-white shadow-md rounded-lg sm:m-8 text-center">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mt-4 mb-4">{title}</h2>
                <div className=' flex justify-center items-center mb-2'>
                    <img className='w-[90%] h-60 md:w-[70%] md:h-80 lg:w-[60%] xl:w-[50%] shadow-xl shadow-gray-200' src={`/Images/${image}`} alt='' />
                </div>
                <div className="p-4">
                    <p className=" mb-4 text-sm text-gray-600 text-start">By {author} on  {new Date(createdDate).toLocaleDateString()}</p>

                    <div dangerouslySetInnerHTML={{ __html: content }} className="sm:text-lg text-start" />
                </div>
            </div>

        </>
    );
};

export default Blog;
