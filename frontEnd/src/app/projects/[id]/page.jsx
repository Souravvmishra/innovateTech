"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ProductItem = ({ params }) => {

    const [item, setItem] = useState([]);
    const [active, setActive] = useState('Introduction')

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/projects/${params?.id}`);
            const data = await response.json();
            console.log(data);
            setItem(data);
        }
        if (params?.id) fetchPosts();
    }, [params.id])
    return (
        <div>
            <div className="p-8  px-44 flex h-[20rem]">
                <Image
                    className="h-full w-auto "
                    src={item[0]?.Image}
                    width={540}
                    height={540}
                    alt="Main"
                />

                <div className="flex flex-col space-y-4">
                    <h1 className="text-4xl font-semibold px-6">{item[0]?.Title}</h1><br></br>
                    <p className="px-6">{item[0]?.Sections?.Abstract}</p>
                    <div className="px-6 ">
                        <button className="px-4 py-2 w-44 bg-pink-600 text-white shadow-sm font-medium">See Options</button>

                        <button className="px-4 py-2 w-44 border shadow-sm font-medium ml-4">Donate</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex w-full flex-wrap gap-2 px-8 ">
                    {
                        item[0]?.['Table of Contents'].map((i) => {
                            return (
                                <div onClick={() => setActive(i)} className={`w-52 px-2 py-4 border ${active === i && 'bg-gray-800 text-white'}`}>{i}</div>
                            )
                        })
                    }
                </div>
            </div>
            {Array.isArray(item[0]?.Sections?.[`${active}`]) ? 
                    <ul className="w-[75%] font-semibold  mx-auto py-8 flex flex-col space-y-4">
                        {
                            item[0]?.Sections?.[`${active}`].map((i) => {
                                return (<li>{i}</li>)
                            })
                        }
                    </ul>
            :
                <div className="w-[75%] font-semibold  mx-auto py-8">
                    {item[0]?.Sections?.[`${active}`]}
                </div>
            }

        </div>
    )
}

export default ProductItem
