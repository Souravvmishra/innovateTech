"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import classes from './style.module.css'
import { SessionProvider } from 'next-auth/react';




import React, { useEffect, useState } from 'react';
import Link from "next/link";

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

            <Link href={`/projects/${item.id}`} className='flex justify-end p-4 bg-gray-100 rounded-b-lg'>
              <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors' >
                Explore
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export function Home() {
  const { data: session } = useSession({
    required: true
  });
  function openNavbar() {
    document.getElementById("sideNavigationBar")
      .classList.toggle('flex')
  }
  const closeNavbar = () => {
    document.getElementById("sideNavigationBar")
      .style.width = "0%";
    console.log("Hello");
  }

  return (
    <SessionProvider session={session}>

      <div>
        {
          session?.user &&
          <body className={`${classes.body} overflow-x-hidden`}>
            <nav className={classes.nav}>
              <div className={classes.heading}>Innovate Tech</div>
              <span className={classes.sideMenuButton} onclick={openNavbar}>
                ☰
              </span>

              <div className={classes.navbar}>
                <ul className="flex justify-center items-center">
                  <li><a href="#">Start a Campaign</a></li>
                  <li><a href="#">What We Do</a></li>
                  <li><a href="#Home">Home</a></li>
                  <li><a href="#">About</a></li>
                  <li><span className='bg-white text-black rounded-lg px-4 py-2 uppercase' >{session.user.name}</span></li>
                  <li><Image src={session.user.image} height={35} width={35} alt="user" className="rounded-full" /></li>
                </ul>
              </div>
            </nav>
            {/* <div className='w-screen h-screen fixed top-0 left-0 bg-black text-white  flex-col justify-center items-center text-2xl font-medium space-y-4 flex' id="sideNavigationBar">
            <div className='absolute top-8 right-8 cursor-pointer ' onclick={() => console.log("dxfghjk")}>
              X
            </div>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Sign Up</a>
          </div> */}

            <div className={classes.line} id="Home">
              <div className={classes.side1}>
                <h1>Supporting Innovators</h1>
                <p className={classes.lead}>Connect with promising projects and help bring ideas to life.</p>
                <button className="px-6 py-2 bg-teal-400 my-4 text-white hover:bg-teal-500 hover:outline outline-offset-2">Explore More</button>
              </div>
              <div className={classes.side2}>
                <Image src="/images/mainImg.jpeg" width="500" height={500} />
              </div>
            </div>
            <Projects />


            <h1 className="text-center display-4 pt-5 my-14 font-semibold text-3xl">Our Services</h1>
            <section className="flex px-80 scale-125">
              <div className="">
                <Image className="border p-3 rounded-3" src="/images/idea.svg" width="400" height={400} alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3><b>Project Idea Submission</b></h3>
                <p className="pe-5 text-secondary">Individuals or teams with innovative project ideas can submit their proposals
                  on the platform. These ideas need to be
                  well-defined and accompanied by a detailed description of the project's purpose, goals, and potential
                  impact.</p>
              </div>
            </section>

            <section className="flex px-80 flex-row-reverse scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-start">
                <Image className="border p-3 rounded-3" src="/images/prototype_present.avif" width="400" alt="" height={400} />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3 className="text-end pe-5"><b>Prototype Presentation</b></h3>
                <p className="pe-5 text-secondary text-end">Project creators are required to provide a prototype or proof of
                  concept of their idea. This could be in the form of a
                  functional demo, mock-up, or visual representation that gives backers a tangible sense of what the final
                  product will
                  look like or how it will work.</p>
              </div>
            </section>

            <section className="flex px-80 flex-row scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-end">
                <Image className="border p-3 rounded-3" src="/images/white-paper.svg" width="400" height={400} alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3><b>Whitepaper Submission</b></h3>
                <p className="pe-5 text-secondary">Alongside the prototype, project creators must submit a whitepaper. This
                  comprehensive document outlines the technical
                  and functional aspects of the project, including the underlying technology, implementation plan,
                  timeline, and potential
                  challenges.
                </p>
              </div>
            </section>

            <section className="flex px-80 flex-row-reverse scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-start">
                <Image className="border p-3 rounded-3" src="/images/review.jpeg" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3 className="text-end pe-5"><b>Review and Verification</b></h3>
                <p className="pe-5 text-secondary text-end">The platform's team of experts reviews the submitted project ideas,
                  prototypes, and whitepapers. They assess the
                  feasibility, innovation, and potential impact of the project. This review process helps ensure that only
                  credible and
                  promising projects are showcased on the platform.</p>
              </div>
            </section>

            <section className="flex px-80 flex-row scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-end">
                <Image className="border p-3 rounded-3" src="/images/project_progress.png" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3><b>Project Progress Tracking</b></h3>
                <p className="pe-5 text-secondary">Once a project is approved and listed on the platform, project creators are
                  required to provide regular updates on the
                  progress of their work. These updates could include milestones achieved, challenges faced, and any
                  adjustments to the
                  original plan.
                </p>
              </div>
            </section>

            <section className="flex px-80  scale-125 my-24 flex-row-reverse">
              <div className="left-pane w-50 p-5 d-flex justify-content-start">
                <Image className="border p-3 rounded-3" src="/images/accounatability.png" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3 className="text-end pe-5"><b>Transparency and Accountability</b></h3>
                <p className="pe-5 text-secondary text-end">Transparency is a key principle of the platform. Project creators
                  are expected to provide clear and accurate information
                  about the funds they receive, how they are being used, and the overall progress of the project. This
                  transparency builds
                  trust among backers.</p>
              </div>
            </section>

            <section className="flex px-80 flex-row scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-end">
                <Image className="border p-3 rounded-3" src="/images/fundraising_campaigns.jpeg" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3><b>Fundraising Campaigns</b></h3>
                <p className="pe-5 text-secondary">Approved projects are then launched as fundraising campaigns on the platform.
                  Backers interested in supporting a project
                  can donate funds to help bring the idea to fruition. The platform can implement different contribution
                  tiers, offering
                  backers various incentives based on their level of support.
                </p>
              </div>
            </section>

            <section className="flex px-80 flex-row-reverse scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-start">
                <Image className="border p-3 rounded-3" src="/images/ongoing_communication.jpeg" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3 className="text-end pe-5"><b>Ongoing Communication</b></h3>
                <p className="pe-5 text-secondary text-end">Effective communication between project creators and backers is
                  essential. Backers should be informed about project
                  updates, potential delays, and other relevant developments throughout the project's lifecycle.</p>
              </div>
            </section>

            <section className="flex px-80 flex-row scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-end">
                <Image className="border p-3 rounded-3" src="/images/milestone.png" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3><b>Milestone-Based Funding</b></h3>
                <p className="pe-5 text-secondary">Funding for projects can be organized based on milestones. As project
                  creators achieve predefined milestones, they can
                  access funds to continue their work. This approach ensures that backers' contributions are directly tied
                  to project
                  progress.
                </p>
              </div>
            </section>

            <section className="flex px-80 flex-row-reverse scale-125 my-24">
              <div className="left-pane w-50 p-5 d-flex justify-content-start">
                <Image className="border p-3 rounded-3" src="/images/rewards.jpg" height={400} width="400" alt="" />
              </div>
              <div className="w-50 d-flex flex-column justify-content-center p-5">
                <h3 className="text-end pe-5"><b>Completion and Rewards</b></h3>
                <p className="pe-5 text-secondary text-end">Once a project reaches its completion stage, backers receive the
                  rewards or benefits promised based on their
                  contribution level. This could include early access to the product, exclusive merchandise, or other
                  perks.
                </p>
              </div>
            </section>

            <section className="contact text-light bg-black text-white py-4" id="contact">
              <div className={classes.content}>
                <div className={classes.contactMenu}>
                  <div className={classes.input1}>
                    <div className={classes.title1}>
                      <span>
                        Contact Us
                      </span>
                    </div>
                    <div className={classes.content1}>
                      Main Road , Ranchi ,
                      Jharkhand - 834002
                    </div>
                  </div>
                  <div className={classes.input3}>
                    <div className={classes.rightside1}>
                      <div className={classes.title1}>
                        <span>More Information</span>
                      </div>
                      <div className={classes.content1}>
                        We welcome you to the platform where we
                        consistently strive to offer the best
                        of projects.The idea revolves around creating
                        a crowdfunding platform that focuses on supporting
                        individuals with promising project ideas.
                        This platform aims to connect project creators
                        with potential backers who are interested in contributing
                        funds to help bring these ideas to life. To ensure a level
                        of credibility and accountability, the project submission
                        process includes several key elements
                        Thank you for choosing
                        and supporting us!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <footer>
              <div className={classes.footer}>
                <span>
                  Created By {' '}
                  <a className="uppercase underline" target="_blank">
                    Innovate Tech
                  </a>
                </span>
              </div>
            </footer>
            <script src="index.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
              integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
              crossorigin="anonymous"></script>
          </body>
        }
      </div>
    </SessionProvider>

  )
}


const Main = ({session}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Home />
      </SessionProvider>

    </>)
}

export default Main 
