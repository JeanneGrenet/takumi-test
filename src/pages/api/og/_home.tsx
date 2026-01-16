export const config = {
  width: 1200,
  height: 630,
  debugScale: 0.5,
};

export default function HomeOGImage() {
  return (
    <div
      tw="flex w-full h-full items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        fontFamily: "Geist, system-ui, sans-serif",
      }}
    >
      <div tw="flex flex-col items-center max-w-4xl p-16">
        <h1 tw="text-9xl font-bold text-white text-center mb-8">
          Mon Portfolio
        </h1>
        <p
          tw="text-5xl text-center"
          style={{
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          Développeur Full-Stack
        </p>
      </div>
    </div>
  );
}
