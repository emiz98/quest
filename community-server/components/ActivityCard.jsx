import { EyeIcon } from "@heroicons/react/24/outline";
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const ActivityCard = ({ id, title, img, refetch }) => {
  const router = useRouter();
  const [deleteModel, setDeleteModel] = useState(false);

  const handleDelete = async () => {
    return await axios.delete("/api/activity/" + id).then(() => refetch());
  };

  return (
    <div className="group cursor-pointer">
      <div className="rounded-xl h-60 object-cover w-full relative overflow-hidden">
        <EyeIcon
          onClick={() => router.push({ pathname: `/activity/${id}` })}
          className="absolute left-0 right-0 z-20 h-12 w-12 top-0 bottom-0 p-2 hover:bg-red-600
         text-white hidden group-hover:inline-block m-auto bg-red-500 rounded-full"
        />
        {deleteModel && (
          <div className="absolute z-40 w-full h-full backdrop-blur-md p-2">
            <div className="flex items-center gap-x-2">
              <XMarkIcon
                onClick={() => setDeleteModel(false)}
                className="h-10 w-10 p-2 bg-blue-500 hover:bg-blue-600 
              transition-all ease-in-out rounded-lg text-white"
              />
              <CheckIcon
                onClick={handleDelete}
                className="h-10 w-10 p-2 bg-green-500 hover:bg-green-600 
              transition-all ease-in-out rounded-lg text-white"
              />
            </div>
          </div>
        )}
        <div
          className="hidden group-hover:inline-block absolute
         z-10 h-full w-full bg-black opacity-20"
        />
        <img
          style={{
            backgroundImage: `url(data:image/png;base64,${Buffer.from(
              img
            ).toString("base64")})`,
            backgroundSize: "contain",
          }}
          className="rounded-xl h-full w-full duration-300
        group-hover:scale-105 transition-all ease-in-out absolute"
        />
        <div className="absolute top-0 p-2 w-full flex items-center justify-between z-30">
          <TrashIcon
            className="btn px-3 h-10 w-10"
            onClick={() => setDeleteModel(true)}
          />
          <span className="text-white bg-black p-3 rounded-lg font-medium text-sm">
            x5 Cards
          </span>
        </div>
      </div>

      <div className="mt-5">
        <h3
          onClick={() => router.push({ pathname: `/activity/${id}` })}
          className="text-lg font-medium hover:underline"
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia
          officiis autem fugit
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
