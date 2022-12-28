import { PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewActivityModel = ({ setNewActivityModel }) => {
  const imageFileRef = useRef(null);
  const [input, setInput] = useState({
    title: "",
    image: "",
  });

  const addImage = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setInput({ ...input, image: Buffer(reader.result) });
    };
  };

  const handleSubmit = async () => {
    if (input.title == "" || input.image == "") {
      toast.error("Please provide necessary details");
    } else {
      const res = await fetch("/api/activity/add", {
        body: {
          title: input.title,
          image: input.image,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "POST",
      });
      // const res = axios
      //   .post("/api/activity/add", {
      //     title: input.title,
      //     image: input.image,
      //   })
      //   .then((response) => {
      //     console.log(response.status);
      //   });
      // if (res.status == 200) {
      //   setNewActivityModel(false);
      // }
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
        onClick={() => setNewActivityModel(false)}
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
        className="relative w-2/5 lg:w-1/5 shadow-lg overflow-hidden rounded-md bg-white p-6 text-black"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Add new activity</span>
          <XMarkIcon
            onClick={() => setNewActivityModel(false)}
            className="w-10 object-contain p-2 border-2 border-black cursor-pointer
        rounded-full hover:bg-black hover:text-white"
          />
        </div>

        <div className="mt-8">
          <input
            value={input.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
            className="rounded-lg bg-gray-200 px-4 py-2 focus:border-black
            outline-none w-full placeholder:text-gray-500 border-2"
            type="text"
            placeholder="Enter activity title"
          />
          <input
            ref={imageFileRef}
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={addImage}
            hidden
            required
          />
          <div
            style={{
              backgroundImage: `url(data:image/png;base64,${Buffer.from(
                input.image
              ).toString("base64")})`,
            }}
            onClick={() => imageFileRef.current.click()}
            className={`mt-2 group flex cursor-pointer flex-col items-center space-y-2 overflow-hidden
        rounded-lg border-2 bg-gray-200 bg-cover bg-center p-10 text-center 
        text-gray-600 transition ease-out hover:border-black hover:bg-gray-100 hover:text-black
        ${input.image && "!text-white"}`}
          >
            <PlusIcon className="w-16 h-16 transition ease-out" />
            <p className="text-xs transition ease-out">Upload Image</p>
          </div>
          <button onClick={handleSubmit} className="btn w-full mt-3">
            Upload Activity
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

export default NewActivityModel;
