'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Projects = () => {
    const [projectData, setProjectData] = useState([]);

    const getProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const tempProjectData = await response.json();
            setProjectData(tempProjectData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    return (
        <div className='container mx-auto py-12 px-4'>
            <h2 className='text-center text-3xl font-semibold mb-6'>Explore Exciting Projects</h2>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {projectData.map((item) => (
                    <div
                        key={item.id}
                        className='bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow'
                    >
                        <div className='relative h-60'>
                            <Image
                                src={item.Image}
                                layout='fill'
                                objectFit='cover'
                                alt={item.Title}
                                className='rounded-t-lg hover:scale-110 transition-all durat300'
                            />
                        </div>

                        <div className='p-6 '>
                            <h3 className='text-xl font-semibold mb-2'>{item.Title}</h3>
                            <p className='text-gray-600'>{item.Sections.Abstract}</p>
                        </div>

                        <div className='flex justify-end p-4 bg-gray-100 rounded-b-lg'>
                            <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
                                Explore
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
