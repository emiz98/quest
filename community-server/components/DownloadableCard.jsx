import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";

const DownloadableCard = ({ img, title }) => {
  return (
    <div
      className="bg-white flex flex-col items-center w-[18rem]
    justify-center border-2 border-red-500 rounded-lg px-8 py-5"
    >
      <Barcode
        width={2}
        height={50}
        value={title}
        displayValue={false}
        lineColor="#000000"
      />
      <h2 className="text-4xl font-bold mt-5 mb-10">{title}</h2>
      <img
        style={{
          backgroundImage: `url(data:image/png;base64,${Buffer.from(
            img
          ).toString("base64")})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
        alt=""
        className="h-52 w-52 rounded-lg border-2 border-red-500"
      />
      {/* <QRCodeSVG value={title} /> */}
    </div>
  );
};

export default DownloadableCard;
