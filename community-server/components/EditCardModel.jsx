import { PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCardModel = ({
  setEditCardModel,
  refetch,
  id,
  title,
  img,
  hints,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [input, setInput] = useState({
    title: title,
    hint1: hints[0],
    hint2: hints[1],
    hint3: hints[2],
  });

  const handleSubmit = async () => {
    if (input.title == "") {
      toast.error("Please provide necessary details");
    } else {
      setIsUploading(true);
      const response = await axios.put(
        "/api/card/" + id,
        {
          title: input.title,
          hints: [input.hint1, input.hint2, input.hint3],
        },
        { headers: { "content-type": "application/json" } }
      );

      if (response.status == 200) {
        refetch();
        setIsUploading(false);
        setEditCardModel(false);
      } else {
        setIsUploading(false);
        toast.error("Update error occurred");
      }
    }
  };

  return (
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
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex 
      h-screen w-screen items-center justify-center backdrop-blur-sm"
    >
      <div
        onClick={() => !isUploading && setEditCardModel(false)}
        className="absolute h-screen w-screen"
      />
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
        className="relative w-4/5 sm:w-2/5 lg:w-1/5 shadow-lg overflow-hidden rounded-md bg-white p-6 text-black"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Update Flash Card</span>
          <XMarkIcon
            onClick={() =>
              !isUploading
                ? setEditCardModel(false)
                : toast.warning("Please wait..")
            }
            className="w-10 object-contain p-2 border-2 border-black cursor-pointer
        rounded-full hover:bg-black hover:text-white"
          />
        </div>

        <div className="mt-8">
          <div
            style={{
              backgroundImage: `url(data:image/png;base64,${Buffer.from(
                img
              ).toString("base64")})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            className={`h-40 group flex flex-col items-center space-y-2 overflow-hidden
        rounded-lg border-2 bg-gray-200 bg-cover bg-center p-10 text-center 
        text-gray-600 transition ease-out ${input.image && "!text-white"}`}
          />
          <input
            value={input.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
            className="rounded-lg mt-2 bg-gray-200 px-4 py-2 focus:border-black
            outline-none w-full placeholder:text-gray-500 border-2"
            type="text"
            placeholder="Enter card title"
          />
          <div className="my-3 space-y-2">
            <input
              value={input.hint1}
              onChange={(e) => setInput({ ...input, hint1: e.target.value })}
              className="rounded-lg bg-gray-200 px-4 py-2 focus:border-black
            outline-none w-full placeholder:text-gray-500 border-2"
              type="text"
              placeholder="Enter hint 1"
            />
            <input
              value={input.hint2}
              onChange={(e) => setInput({ ...input, hint2: e.target.value })}
              className="rounded-lg bg-gray-200 px-4 py-2 focus:border-black
            outline-none w-full placeholder:text-gray-500 border-2"
              type="text"
              placeholder="Enter hint 2"
            />
            <input
              value={input.hint3}
              onChange={(e) => setInput({ ...input, hint3: e.target.value })}
              className="rounded-lg bg-gray-200 px-4 py-2 focus:border-black
            outline-none w-full placeholder:text-gray-500 border-2"
              type="text"
              placeholder="Enter hint 3"
            />
          </div>
          <button
            disabled={isUploading}
            onClick={handleSubmit}
            className="btn w-full mt-3 disabled:cursor-default hover:bg-red-500"
          >
            {isUploading ? (
              <div className="flex items-center gap-x-3 justify-center">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-200 animate-spin dark:text-red-800 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span>Updating</span>
              </div>
            ) : (
              <span>Update Card</span>
            )}
          </button>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="light"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditCardModel;
