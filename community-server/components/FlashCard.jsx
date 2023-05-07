import {
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DownloadableCard from "./DownloadableCard";
import html2canvas from "html2canvas";
import EditCardModel from "./EditCardModel";

const FlashCard = ({ title, img, id, hints, refetch }) => {
  const myComponentRef = useRef(null);
  const [deleteModel, setDeleteModel] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [viewModel, setViewModel] = useState(false);

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
      <AnimatePresence>
        {editModel && (
          <EditCardModel
            id={id}
            title={title}
            img={img}
            hints={hints}
            setEditCardModel={setEditModel}
            refetch={refetch}
          />
        )}
      </AnimatePresence>
      <div className="flex items-center gap-x-5">
        <img
          onClick={() => setViewModel(true)}
          style={{
            backgroundImage: `url(data:image/png;base64,${Buffer.from(
              img
            ).toString("base64")})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
          className="h-20 w-20 rounded-lg border-2 border-red-400 cursor-pointer"
        />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="absolute -top-96 -left-96" ref={myComponentRef}>
        <DownloadableCard img={img} title={title} />
      </div>
      <div className="flex items-center gap-x-1">
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
              transition-all ease-in-out rounded-lg text-white cursor-pointer"
                />
                <XMarkIcon
                  onClick={() => setDeleteModel(false)}
                  className="h-10 w-10 p-2 bg-blue-500 hover:bg-blue-600 
              transition-all ease-in-out rounded-lg text-white cursor-pointer"
                />
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-x-1 md:gap-x-5">
              <div className="flex items-center gap-x-1">
                <EyeIcon
                  onClick={() => setViewModel(true)}
                  className="hidden sm:inline-flex h-10 w-10 p-2 bg-orange-500 hover:bg-orange-600 
              transition-all ease-in-out rounded-lg text-white cursor-pointer"
                />
                <ArrowDownTrayIcon
                  onClick={() => downloadImage(myComponentRef.current)}
                  className="h-10 w-10 p-2 bg-green-500 hover:bg-green-600 
              transition-all ease-in-out rounded-lg text-white cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-x-1">
                <PencilIcon
                  onClick={() => setEditModel(true)}
                  className="h-10 w-10 p-2 bg-blue-500 hover:bg-blue-600 
              transition-all ease-in-out rounded-lg text-white cursor-pointer"
                />
                <TrashIcon
                  className="h-10 w-10 btn p-2 cursor-pointer"
                  onClick={() => setDeleteModel(true)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {viewModel && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setViewModel(false)}
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex 
        h-screen w-screen items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              exit={{
                scale: 0,
              }}
              className="relative shadow-lg overflow-hidden rounded-md bg-white p-6 text-black"
            >
              <DownloadableCard img={img} title={title} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashCard;
