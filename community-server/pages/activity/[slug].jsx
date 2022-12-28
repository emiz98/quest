import Head from "next/head";
import Header from "../../components/Header";
import FlashCard from "../../components/FlashCard";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NewCardModel from "../../components/NewCardModel";

const data = [
  {
    name: "Pineapple",
    img: "https://png.pngtree.com/png-vector/20201111/ourlarge/pngtree-vector-simple-cute-pineapple-clipart-png-image_2413289.jpg",
  },
  {
    name: "Apple",
    img: "https://illustoon.com/photo/766.png",
  },
  {
    name: "Grapes",
    img: "https://www.pngkey.com/png/detail/22-221852_large-painted-grapes-png-clipart-grapes-clipart.png",
  },
  {
    name: "Orange",
    img: "https://illustoon.com/photo/801.png",
  },
  {
    name: "Pineapple",
    img: "https://png.pngtree.com/png-vector/20201111/ourlarge/pngtree-vector-simple-cute-pineapple-clipart-png-image_2413289.jpg",
  },
  {
    name: "Apple",
    img: "https://illustoon.com/photo/766.png",
  },
  {
    name: "Grapes",
    img: "https://www.pngkey.com/png/detail/22-221852_large-painted-grapes-png-clipart-grapes-clipart.png",
  },
  {
    name: "Orange",
    img: "https://illustoon.com/photo/801.png",
  },
];
const Activity = ({ project }) => {
  const [newCardModel, setNewCardModel] = useState(false);
  return (
    <div className="h-screen overflow-hidden">
      <Head>
        <title>Quest - {project}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <AnimatePresence>
        {newCardModel && <NewCardModel setNewCardModel={setNewCardModel} />}
      </AnimatePresence>
      <main className="p-5">
        <div className="mt-20 flex items-center justify-between mb-10">
          <h2 className="text-2xl font-medium">{project}</h2>
          <button onClick={() => setNewCardModel(true)} className="btn">
            Add Flash Card
          </button>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 scrollbar-hide
        xl:grid-cols-3 gap-5 h-[80vh] overflow-y-scroll"
        >
          {data.map(({ name, img }, i) => (
            <FlashCard title={name} img={img} key={i} index={i + 1} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Activity;

export const getServerSideProps = async (context) => {
  const project = context.query.slug;

  return {
    props: {
      project,
    },
  };
};
