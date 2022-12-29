import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FlashCard = ({ title, img, index, id, refetch }) => {
  const [deleteModel, setDeleteModel] = useState(false);

  const handleDelete = async () => {
    return await axios.delete("/api/card/" + id).then(() => refetch());
  };

  return (
    <div
      className="flex items-center justify-between h-28 select-none
    bg-gray-100 rounded-lg p-2 border-2 border-red-400"
    >
      <div className="flex items-center gap-x-5">
        {/* <div
          className="border-2 border-red-200 p-3 rounded-lg
        text-xl font-medium text-gray-600"
        >
          #{index}
        </div> */}
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
            <TrashIcon
              className="h-10 w-10 btn p-2"
              onClick={() => setDeleteModel(true)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlashCard;
