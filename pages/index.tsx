import Head from "next/head";
import styles from '../styles/HomeNoAuth.module.scss';
import HeaderNoAuth from "../src/components/HomeNoAuth/HeaderNoAuth";
import PresentationSection from "../src/components/HomeNoAuth/presentationSection";
import CardsSection from "../src/components/HomeNoAuth/cardsSections";
import { GetStaticProps } from "next";
import courseService, { CourseType } from "../src/services/courseService";
import { ReactNode } from "react";
import SlideSection from "../src/components/HomeNoAuth/slideSection";
import Footer from "../src/components/common/footer";

interface IndexPageProps {
  children?: ReactNode;
  course: CourseType[];
}

const HomeNotAuth = function ({course}: IndexPageProps) {
  return (
    <>
      <Head>
        <title>Onebitflix</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
				<meta property="og:title" content="Onebitflix" key="title" />
				<meta name="description" content="Tenha acesso aos melhores conteúdos sobre 
        programação de uma forma simples e fácil."/>
      </Head>
      <main>
        <div className={styles.sectionBackground}>
          <HeaderNoAuth/>
          <PresentationSection/>
        </div>
         <CardsSection />
         <SlideSection newestCourses={course}/>
         <Footer/>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await courseService.getNewestCourses();
  return {
    props: {
      course: res.data,
    },
    revalidate: 3600 * 24,
  };
};

export default HomeNotAuth;