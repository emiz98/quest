import Head from "next/head";
import Header from "../../components/Header";
import FlashCard from "../../components/FlashCard";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NewCardModel from "../../components/NewCardModel";

const Activity = ({ activity, cards }) => {
  const [newCardModel, setNewCardModel] = useState(false);
  const [cardsTemp, setCardsTemp] = useState(cards);

  const refetch = async () => {
    const res = await fetch(`/api/card/all?actID=${activity.data._id}`).then(
      (res) => res.json()
    );
    setCardsTemp(res);
  };

  return (
    <div className="">
      <Head>
        <title>Quest - {activity.data.title}</title>
        <link rel="icon" href="/favicon.ico" />
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
          <button onClick={() => setNewCardModel(true)} className="btn">
            Add Flash Card
          </button>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 scrollbar-hide
        xl:grid-cols-3 gap-5"
        >
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
