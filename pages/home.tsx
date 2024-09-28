import Head from "next/head";
import HeaderAuth from "../src/components/common/headerAuth";
import FeaturedSection from "../src/components/homeAuth/featuresSection";
import NewestCategory from "../src/components/homeAuth/newestCategory";
import FavoritesCategory from "../src/components/homeAuth/favoriteCategory";
import FeaturedCategory from "../src/components/homeAuth/featuredCategory";

const HomeAuth = function () {
    return (
      <>
        <Head>
            <title>Onebitflix - Home</title>
            <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
        </Head>
        <main>
            <FeaturedSection/>
            <NewestCategory/>
            <FavoritesCategory/>
            <FeaturedCategory />
        </main>
      </>
    );
  };
  
  export default HomeAuth;