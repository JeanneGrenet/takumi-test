export default function HomeOG() {
  return (
    <div
      tw="flex w-full h-full items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
      }}
    >
      <div tw="flex flex-col items-center p-20">
        <h1 tw="text-9xl font-bold text-white mb-8">Mon Site Web</h1>
        <p tw="text-5xl text-white">Bienvenue sur mon site</p>
      </div>
    </div>
  );
}
