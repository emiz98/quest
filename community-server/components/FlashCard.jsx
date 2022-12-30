import {
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DownloadableCard from "./DownloadableCard";
import html2canvas from "html2canvas";

const FlashCard = ({ title, img, index, id, refetch }) => {
  const myComponentRef = useRef(null);
  const [deleteModel, setDeleteModel] = useState(false);

  const handleDelete = async () => {
    return await axios.delete("/api/card/" + id).then(() => refetch());
  };

  function downloadImage(component) {
    html2canvas(component).then((canvas) => {
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL();

      // Create a link element and set its href to the data URL
      const link = document.createElement("a");
      link.download = title + ".jpg";
      link.href = dataURL;

      // Append the link to the DOM and click it to trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
    });
  }

  return (
    <div
      className="flex items-center justify-between h-28 select-none
    bg-gray-100 rounded-lg p-2 border-2 border-red-400"
    >
      <div className="flex items-center gap-x-5">
        <img
          style={{
            backgroundImage: `url(data:image/png;base64,${Buffer.from(
              img
            ).toString("base64")})`,
            backgroundSize: "contain",
          }}
          className="h-20 w-20 rounded-lg border-2 border-red-400"
        />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="absolute -top-96 -left-96" ref={myComponentRef}>
        <DownloadableCard img={img} title={title} />
      </div>
      <div className="flex items-center gap-x-2">
        <AnimatePresence>
          {deleteModel ? (
            <motion.div
              initial={{
                opacity: 0,
                translateX: 15,
              }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: {
                  duration: 0.3,
                },
              }}
              exit={{
                translateX: 15,
                opacity: 0,
              }}
              className="p-2"
            >
              <div className="flex items-center gap-x-2">
                <CheckIcon
                  onClick={handleDelete}
                  className="h-10 w-10 p-2 bg-green-500 hover:bg-green-600 
              transition-all ease-in-out rounded-lg text-white"
                />
                <XMarkIcon
                  onClick={() => setDeleteModel(false)}
                  className="h-10 w-10 p-2 bg-blue-500 hover:bg-blue-600 
              transition-all ease-in-out rounded-lg text-white"
                />
              </div>
            </motion.div>
          ) : (
            <>
              <ArrowDownTrayIcon
                onClick={() => downloadImage(myComponentRef.current)}
                className="h-10 w-10 p-2 bg-green-500 hover:bg-green-600 
              transition-all ease-in-out rounded-lg text-white"
              />
              <TrashIcon
                className="h-10 w-10 btn p-2"
                onClick={() => setDeleteModel(true)}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlashCard;
