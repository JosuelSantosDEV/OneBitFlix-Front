import { useRouter } from "next/router";
import styles from "../../../styles/episodePlayer.module.scss";
import Head from "next/head";
import HeaderGeneric from "../../../src/components/common/headerGeneric";
import { useEffect, useRef, useState } from "react";
import courseService, { CourseType } from "../../../src/services/courseService";
import PageSpinner from "../../../src/components/common/spinner";
import { Button, Container } from "reactstrap";
import ReactPlayer from "react-player";
import watchEpisodeService from "../../../src/services/watchEpisodeService";

const EpisodePlayer = function () {

    const router = useRouter();

    const playerRef = useRef<ReactPlayer>(null);

    const [course, setCourse] = useState<CourseType>();
    const [getEpisodeTime, setGetEpisodeTime] = useState(0);
    const [episodeTime, setEpisodeTime] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const episodeOrder = parseFloat(router.query.id?.toString() || "");
    const courseId = router.query.courseid?.toString() || "";
    const episodeId = parseFloat(router.query.episodeid?.toString() || "");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionStorage.getItem("onebitflix-token")) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, []);

    const handleGetEpisodeTime = async () => {
      const res = await watchEpisodeService.getWatchTime(episodeId);
      if (res.data !== null) {
        setGetEpisodeTime(res.data.seconds);
      }
      
    };

    const handleSetEpisodeTime = async () => {
      await watchEpisodeService.setWatchTime({
        episodeId: episodeId,
        seconds: Math.round(episodeTime),
      });
    };
    
    const handlePlayerTime = () => {
      try {
          playerRef.current?.seekTo(getEpisodeTime);
          setIsReady(true);
      } catch (error) {
        
      }
    };

    if (isReady === true) {
      setTimeout(() => {
        handleSetEpisodeTime();
      }, 1000 * 3);
    }
    
    useEffect(() => {
      handleGetEpisodeTime();
    }, [router]);


    const getCourse = async function () {
        if (typeof courseId !== "string") return;

        const res = await courseService.getEpisodes(courseId);
        if (res.status === 200) {
            setCourse(res.data);
        }
    };

    useEffect(() => {
      getCourse();
    }, [courseId]);

    if (loading) {
      return <PageSpinner />;
    }

    if(course?.episodes === undefined) return <PageSpinner/>;

    const handleLastEpisode = () => {
      router.push(`/course/episode/${episodeOrder - 1}?courseid=${course.id}&episodeid=${episodeId - 1}`);
    };
    
    const handleNextEpisode = () => {
      router.push(`/course/episode/${episodeOrder + 1}?courseid=${course.id}&episodeid=${episodeId + 1}`);
    };


    if (episodeOrder + 1 < course?.episodes?.length) {
      if (Math.round(episodeTime) === course.episodes[episodeOrder].secondsLong) {
        handleNextEpisode();
      }
    }

  return (
    <>
      <Head>
        <title>Onebitflix - {course.episodes[episodeOrder].name}</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
      </Head>
      <main>
        <HeaderGeneric logoUrl="/home" btnContent={`Voltar para o curso`} btnUrl={`/course/${courseId}`} />
        <Container className="d-flex flex-column align-items-center gap-3 pt-3">
            <p className={styles.episodeTitle}>
	            {course.episodes[episodeOrder].name}
            </p>
            {typeof window == "undefined" ? null : (
                <ReactPlayer
                    className={styles.player}
                    url={`${
	                    process.env.NEXT_PUBLIC_BASEURL
                        }/episodes/stream?videoUrl=${
	                    course.episodes[episodeOrder].videoUrl
                        }&token=${sessionStorage.getItem("onebitflix-token")}`}
                    controls
                    ref={playerRef}
                    onStart={handlePlayerTime}
                    onProgress={(progress) => setEpisodeTime(progress.playedSeconds)}
                />
            )}
            <div className={styles.episodeButtonDiv}>
                <Button className={styles.episodeButton} disabled={episodeOrder === 0 ? true : false } onClick={handleLastEpisode}>
                    <img src="/episode/iconArrowLeft.svg" alt="setaEsquerda" className={styles.arrowImg}/>
                </Button>
                <Button className={styles.episodeButton} disabled={episodeOrder + 1 === course.episodes.length ? true : false} onClick={handleNextEpisode}>
                    <img src="/episode/iconArrowRight.svg" alt="setaDireita" className={styles.arrowImg}/>
                </Button>
            </div>
            <p className="text-center pb-4">
	            {course.episodes[episodeOrder].synopsis}
            </p>
        </Container>
      </main>
    </>
  );
};

export default EpisodePlayer;