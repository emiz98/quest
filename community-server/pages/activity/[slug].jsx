import Head from "next/head";
import Header from "../../components/Header";
import FlashCard from "../../components/FlashCard";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import NewCardModel from "../../components/NewCardModel";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import DownloadableCard from "../../components/DownloadableCard";
import html2canvas from "html2canvas";

const Activity = ({ activity, cards }) => {
  const [newCardModel, setNewCardModel] = useState(false);
  const [cardsTemp, setCardsTemp] = useState(cards);
  const cardsRefs = cardsTemp.data.map(() => useRef(null));

  const refetch = async () => {
    const res = await fetch(`/api/card/all?actID=${activity.data._id}`).then(
      (res) => res.json()
    );
    setCardsTemp(res);
  };

  function downloadImage(component, title) {
    for (let index = 0; index < cardsTemp.data.length; index++) {
      html2canvas(component[index].current).then((canvas) => {
        // Convert the canvas to a data URL
        const dataURL = canvas.toDataURL();

        // Create a link element and set its href to the data URL
        const link = document.createElement("a");
        link.download = cardsTemp.data[index].title + ".jpg";
        link.href = dataURL;

        // Append the link to the DOM and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM
        document.body.removeChild(link);
      });
    }
  }

  return (
    <div className="">
      <Head>
        <title>Quest - {activity.data.title}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />
      <AnimatePresence>
        {newCardModel && (
          <NewCardModel
            setNewCardModel={setNewCardModel}
            actID={activity.data._id}
            refetch={refetch}
          />
        )}
      </AnimatePresence>
      <main className="p-5 px-5 md:px-10 lg:px-20 xl:px-40">
        <div className="mt-20 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-y-3">
          <h2 className="text-2xl font-medium">{activity.data.title}</h2>
          <div className="flex items-center gap-x-3">
            <button onClick={() => setNewCardModel(true)} className="btn">
              Add Flash Card
            </button>
            <ArrowDownTrayIcon
              onClick={() => downloadImage(cardsRefs, "title")}
              className="h-10 w-10 p-2 bg-green-500 hover:bg-green-600 
              transition-all ease-in-out rounded-lg text-white"
            />
          </div>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 scrollbar-hide
        xl:grid-cols-3 gap-5"
        >
          {cardsTemp.data.length == 0 && (
            <div className="flex flex-col items-center border-2 border-red-400 rounded-lg">
              <img src="/empty.gif" className="h-2/3 object-contain" />
              <h5 className="text-lg w-1/2 text-center">
                Looks like this activity contains no flash cards at the moment.
              </h5>
            </div>
          )}
          {cardsTemp.data.map(({ _id, title, image }, i) => (
            <FlashCard
              title={title}
              img={image}
              key={_id}
              index={i + 1}
              id={_id}
              refetch={refetch}
            />
          ))}
          {cardsTemp.data.map(({ _id, title, image }, i) => (
            <div
              key={_id}
              className="absolute -left-96 -right-96 w-[18rem]"
              ref={cardsRefs[i]}
            >
              <DownloadableCard title={title} img={image} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Activity;

export const getServerSideProps = async (context) => {
  const activity = await fetch(
    `${process.env.NEXTAUTH_URL}/api/activity/${context.query.slug}`
  ).then((res) => res.json());
  const cards = await fetch(
    `${process.env.NEXTAUTH_URL}/api/card/all?actID=${context.query.slug}`
  ).then((res) => res.json());

  return {
    props: {
      activity,
      cards,
    },
  };
};
