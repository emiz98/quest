import Head from "next/head";
import { QRCodeSVG } from "qrcode.react";
import ActivityCard from "../components/ActivityCard";
import NewActivityModel from "../components/NewActivityModel";
import Header from "../components/Header";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const data = [
  {
    name: "Identify Fruits",
    img: "https://static.vecteezy.com/system/resources/previews/007/580/121/original/tropical-fruits-pattern-seamless-background-free-vector.jpg",
  },
  {
    name: "Identify Alphabet",
    img: "https://media.istockphoto.com/id/628370756/vector/seamless-vector-pattern-different-letters-abc.jpg?s=612x612&w=0&k=20&c=SocvQKkUlnBZ6m902p8zKgqOHv0-Y2wFhaqHsIsFYnA=",
  },
  {
    name: "Identify Animals",
    img: "https://previews.123rf.com/images/elsystudio/elsystudio1409/elsystudio140900008/31963196-cute-animals-head-background-design.jpg",
  },
  {
    name: "Identify Vegetables",
    img: "https://static.vecteezy.com/system/resources/previews/007/584/210/non_2x/seamless-background-design-with-green-fruits-and-vegetables-free-vector.jpg",
  },
  {
    name: "Identify Body Parts",
    img: "https://img.freepik.com/premium-vector/cartoon-human-internal-organs-background-pattern-white-medicine-anatomy-flat-style-design-web-vector-illustration_287964-1360.jpg?w=2000",
  },
  {
    name: "Identify Shapes",
    img: "https://img.freepik.com/free-vector/flat-design-geometric-shapes-background_23-2148366514.jpg?w=2000",
  },
];

const Home = () => {
  const [newActivityModel, setNewActivityModel] = useState(false);
  return (
    <div className="bg-white h-screen overflow-hidden">
      <Head>
        <title>Quest - Community Server</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <AnimatePresence>
        {newActivityModel && (
          <NewActivityModel setNewActivityModel={setNewActivityModel} />
        )}
      </AnimatePresence>
      <main className="px-10 pt-5">
        <div className="mt-20 mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-medium">Community activities</h2>
          <button onClick={() => setNewActivityModel(true)} className="btn">
            Add activity
          </button>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2  scrollbar-hide
        md:grid-cols-3 lg:grid-cols-4 gap-5 overflow-y-scroll h-[81vh]"
        >
          {data.map(({ name, img }, i) => (
            <ActivityCard key={i} title={name} img={img} />
          ))}
        </div>

        {/* <QRCodeSVG value="https://reactjs.org/" /> */}
      </main>
    </div>
  );
};

export default Home;
