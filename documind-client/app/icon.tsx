import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 3C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9L14 3H6Z"
            fill="white"
            fillOpacity="0.2"
            stroke="white"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M14 3V9H20" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 11V16M9.5 13.5H14.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="12" cy="13.5" r="1.25" fill="#38BDF8" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
