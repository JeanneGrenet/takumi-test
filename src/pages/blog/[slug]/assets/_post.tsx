import { getEntry } from "astro:content";

interface PostOGImageParams {
  params: { slug?: string };
  site?: URL;
  url: URL;
}

export const config = {
  width: 1200,
  height: 630,
  debugScale: 0.5,
};

export default async function PostOGImage({ params }: PostOGImageParams) {
  const slug = params.slug;

  if (!slug) {
    throw new Error("Missing post slug");
  }

  const post = await getEntry("blog", slug);

  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  const { title, description, tags = [], author: authorId, date } = post.data;
  const author = await getEntry("author", authorId.id);

  return (
    <div
      tw="flex flex-col w-full h-full p-16"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Geist, Thai, Jap, KR, Arabic",
      }}
    >
      <p>
        English: The quick brown fox jumps over the lazy dog. Thai: โลเร็ม
        อิปซัม ดอลอร์ Japanese: 吾輩は猫である Chinese: 天地玄黄宇宙洪荒 Korean:
        국회는 헌법 또는 법률 Arabic: لوريم إيبسوم دولور Russian: Лорем ипсум
        долор Greek: Λορεμ ιπσυμ δολορ
      </p>

      <div tw="flex flex-col flex-1 justify-center">
        {tags.length > 0 && (
          <div tw="flex flex-wrap mb-6">
            {tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                tw="text-xl px-4 py-2 rounded-full mr-3"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1
          tw="font-bold text-white mb-6"
          style={{
            fontSize: title.length > 50 ? 56 : 72,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            tw="text-3xl"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.4,
            }}
          >
            {description.substring(0, 150)}
          </p>
        )}
      </div>

      <div
        tw="flex justify-between items-center pt-8"
        style={{
          borderTop: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div tw="flex flex-col">
          <span tw="text-2xl" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            Blog Post
          </span>
          {author && (
            <>
              <span tw="text-xl" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Par {author.data.name}
              </span>
            </>
          )}
        </div>
        {date && (
          <span tw="text-xl" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            {new Date(date).toLocaleDateString("fr-FR")}
          </span>
        )}
      </div>
    </div>
  );
}
