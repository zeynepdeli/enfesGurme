"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";

type AboutPageData = {
  backgroundColor: string;
  cardBgImage: string;
  textureImage: string;

  sketchImageOne?: string;
  sketchImageTwo?: string;
  sketchImageThree?: string;
  sketchImageFour?: string;

  visionTitle: string;
  visionText: string;
  visionImage: string;
  visionMiniImage?: string;

  missionHeading: string;
  missionTitle: string;
  missionText: string;
  missionImage: string;

  storyHeading: string;
  storyTitle: string;
  storyText: string;
  storyImage: string;

  valuesHeading: string;
  valuesTitle: string;
  valuesText: string;
  valuesImage: string;

  miniImageOne: string;
  miniImageTwo: string;
  miniImageThree: string;
};

type AboutSection = {
  id: "vision" | "mission" | "story" | "values";
  heading?: string;
  title: string;
  text: string;
  image: string;
  contain?: boolean;
};

const FALLBACKS = {
  bg: "#ede0c4",
  card: "/cardDuvar.png",
  texture: "/duvarBg.png",
};

const styles = {
  main: "relative min-h-screen overflow-x-hidden overflow-y-visible",

  section:
    "relative z-10 mx-auto w-full max-w-[1440px] md:mt-8 px-4 pb-8 pt-[88px] min-[445px]:px-5 min-[445px]:pt-[96px] md:px-8 md:pt-[112px] lg:px-6 lg:pt-[96px] xl:px-8 xl:pt-[100px] 2xl:px-12 2xl:pt-[106px]",

  desktop:
    "hidden h-[calc(97vh-120px)] max-h-[calc(100vh-120px)] grid-rows-[0.95fr_0.85fr]   gap-4 lg:grid xl:gap-5 2xl:gap-6",

  desktopRow: "grid min-h-0 grid-cols-[1.02fr_0.98fr] gap-4 xl:gap-5 2xl:gap-6",

  heading:
    "font-serif font-black leading-none tracking-[-0.03em] text-[#351509] text-[20px] min-[445px]:text-[22px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]",

  title:
    "font-serif font-black leading-[1.15] tracking-[-0.04em] text-[#351509] text-[20px] min-[445px]:text-[23px] md:text-[24px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]",

  body: "font-medium leading-[1.38] text-[#2d2117] text-[11px] min-[445px]:text-[12px] md:text-[13px] lg:text-[11px] xl:text-[11.5px] 2xl:text-[12.5px]",
};

const desktopImageSize = {
  mission: {
    width: "w-[48%] xl:w-[40%] 2xl:w-[52%] ",
    aspect: "1 / 0.82",
  },

  story: {
    width: "w-[34%] xl:w-[34%] 2xl:w-[38%]",
    aspect: "1 / 0.95",
  },

  values: {
    width: "w-[50%] xl:w-[45%] 2xl:w-[56%]",
    aspect: "1.25 / 0.9",
  },
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutPageData | null>(null);

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await api.get<AboutPageData>("/api/about-page");
        setAbout(res.data || null);
      } catch (error) {
        console.error("About page fetch error:", error);
      }
    }

    loadAbout();
  }, []);

  const sections = useMemo<AboutSection[]>(() => {
    if (!about) return [];

    return [
      {
        id: "vision",
        title: about.visionTitle,
        text: about.visionText,
        image: about.visionImage,
      },
      {
        id: "mission",
        heading: about.missionHeading,
        title: about.missionTitle,
        text: about.missionText,
        image: about.missionImage,
      },
      {
        id: "story",
        heading: about.storyHeading,
        title: about.storyTitle,
        text: about.storyText,
        image: about.storyImage,
      },
      {
        id: "values",
        heading: about.valuesHeading,
        title: about.valuesTitle,
        text: about.valuesText,
        image: about.valuesImage,
        contain: true,
      },
    ];
  }, [about]);

  if (!about) return null;

  return (
    <main
      className={styles.main}
      style={{ backgroundColor: about.backgroundColor || FALLBACKS.bg }}
    >
      <AboutBackground about={about} />

      <section className={styles.section}>
        <DesktopAbout about={about} />
        <ResponsiveCards about={about} sections={sections} />
      </section>
    </main>
  );
}

function AboutBackground({ about }: { about: AboutPageData }) {
  const sketches = [
    {
      src: about.sketchImageOne,
      className:
        "left-[-12%] top-[12%] w-[70%] opacity-[0.12] sm:left-[-8%] sm:w-[44%] md:left-[5%] md:w-[30%] lg:left-[27%] lg:top-[20%] lg:w-[24%] lg:opacity-[0.2] 2xl:w-[30%]",
    },
    {
      src: about.sketchImageTwo,
      className:
        "left-[-10%] top-[52%] w-[58%] opacity-[0.1] sm:left-[2%] sm:w-[34%] md:w-[24%] lg:left-[30%] lg:top-[64%] lg:w-[14%] lg:opacity-[0.2] 2xl:w-[16%]",
    },
    {
      src: about.sketchImageThree,
      className:
        "right-[-16%] top-[68%] w-[62%] opacity-[0.1] sm:right-[-8%] sm:w-[36%] md:w-[26%] lg:right-[2%] lg:top-[65%] lg:w-[18%] lg:opacity-[0.2]",
    },
    {
      src: about.sketchImageFour,
      className:
        "right-[-20%] top-[18%] w-[70%] scale-[1.2] opacity-[0.1] sm:right-[-10%] sm:w-[42%] md:w-[30%] lg:right-[2%] lg:top-[24%] lg:w-[22%] lg:scale-[1.25] lg:opacity-[0.2]",
    },
  ];

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,252,240,0.55)_0%,transparent_70%)]" />

      {sketches.map(
        (item, index) =>
          item.src && (
            <img
              key={index}
              src={item.src}
              alt=""
              className={`pointer-events-none absolute z-[1] mix-blend-multiply ${item.className}`}
            />
          ),
      )}
    </>
  );
}

function DesktopAbout({ about }: { about: AboutPageData }) {
  return (
    <div className={styles.desktop}>
      <div className={styles.desktopRow}>
        <VisionSection about={about} />
        <MissionSection about={about} />
      </div>

      <div className={styles.desktopRow}>
        <StorySection about={about} />
        <ValuesSection about={about} />
      </div>
    </div>
  );
}

function VisionSection({ about }: { about: AboutPageData }) {
  return (
    <div className="relative min-h-0 overflow-visible">
      <div className="absolute left-[-42%] top-[-4%] h-[100%] w-[100%] overflow-hidden rounded-br-[18px] 2xl:h-[108%]">
        <Image
          src={about.visionImage}
          alt={about.visionTitle}
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_48%,rgba(237,224,196,0.88)_86%,rgba(237,224,196,1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,rgba(237,224,196,0.82)_82%,rgba(237,224,196,1)_100%)]" />
      </div>

      <div className="absolute left-[34%] top-[13%] z-10 w-[58%]">
        <h1 className={`${styles.heading} leading-[0.95] tracking-[-0.04em]`}>
          {about.visionTitle}
        </h1>

        <p className={`${styles.body} mt-2 max-w-[340px]`}>
          {about.visionText}
        </p>

        <div className="relative ml-[-10%] aspect-[1.7] w-[88%] xl:mt-[-8%] 2xl:mt-[4%]">
          <Image
            src={about.visionMiniImage || about.miniImageOne}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function MissionSection({ about }: { about: AboutPageData }) {
  return (
    <ContentSection
      heading={about.missionHeading}
      image={about.missionImage}
      title={about.missionTitle}
      text={about.missionText}
      cardBgImage={about.cardBgImage}
      textureImage={about.textureImage}
      imageClassName={desktopImageSize.mission.width}
      imageAspect={desktopImageSize.mission.aspect}
      sectionClassName="lg:mt-8 xl:mt-12 2xl:mt-10"
      headingClassName="mb-2 ml-[4%]"
      contentClassName="gap-3 xl:gap-4"
    />
  );
}

function ValuesSection({ about }: { about: AboutPageData }) {
  return (
    <ContentSection
      heading={about.valuesHeading}
      image={about.valuesImage}
      title={about.valuesTitle}
      text={about.valuesText}
      cardBgImage={about.cardBgImage}
      textureImage={about.textureImage}
      imageClassName={desktopImageSize.values.width}
      imageAspect={desktopImageSize.values.aspect}
      contain
      sectionClassName="translate-y-2 lg:mt-4 xl:mt-8 2xl:mt-10"
      headingClassName="mb-5 ml-[6%]"
      contentClassName="gap-4 xl:gap-5"
    />
  );
}

function StorySection({ about }: { about: AboutPageData }) {
  return (
    <div className="relative top-3 flex min-h-0 flex-col justify-center 2xl:ml-[-30%]">
      <h2 className={`${styles.heading} mb-3`}>{about.storyHeading}</h2>

      <div className="flex min-h-0 items-start gap-3 xl:gap-4">
        <MiniImageColumn about={about} />

        <ImageCard
          image={about.storyImage}
          alt={about.storyTitle}
          cardBgImage={about.cardBgImage}
          textureImage={about.textureImage}
          className={desktopImageSize.story.width}
          aspect={desktopImageSize.story.aspect}
        />

        <TextBlock title={about.storyTitle} text={about.storyText} narrow />
      </div>
    </div>
  );
}

function ContentSection({
  heading,
  image,
  title,
  text,
  cardBgImage,
  textureImage,
  imageClassName,
  imageAspect,
  contain = false,
  sectionClassName = "",
  headingClassName = "",
  contentClassName = "",
}: {
  heading: string;
  image: string;
  title: string;
  text: string;
  cardBgImage: string;
  textureImage: string;
  imageClassName: string;
  imageAspect: string;
  contain?: boolean;
  sectionClassName?: string;
  headingClassName?: string;
  contentClassName?: string;
}) {
  return (
    <div
      className={`relative flex min-h-0 flex-col justify-center ${sectionClassName}`}
    >
      <h2 className={`${styles.heading} ${headingClassName}`}>{heading}</h2>

      <div className={`flex min-h-0 items-start ${contentClassName}`}>
        <ImageCard
          image={image}
          alt={title}
          cardBgImage={cardBgImage}
          textureImage={textureImage}
          className={imageClassName}
          aspect={imageAspect}
          contain={contain}
        />

        <TextBlock title={title} text={text} />
      </div>
    </div>
  );
}

function MiniImageColumn({ about }: { about: AboutPageData }) {
  return (
    <div className="mt-2 flex shrink-0 flex-col gap-4 2xl:gap-10">
      {[about.miniImageOne, about.miniImageTwo, about.miniImageThree].map(
        (src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-[52px] w-[52px] overflow-hidden rounded-[12px] border border-[#d8bf8a]/80 bg-cover shadow-[0_6px_18px_rgba(80,55,28,0.13)] xl:h-[58px] xl:w-[58px] 2xl:h-[74px] 2xl:w-[64px]"
            style={{
              backgroundImage: `url('${about.cardBgImage || FALLBACKS.card}')`,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="scale-[1.18] object-contain p-1"
            />
          </div>
        ),
      )}
    </div>
  );
}

function ResponsiveCards({
  about,
  sections,
}: {
  about: AboutPageData;
  sections: AboutSection[];
}) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 md:gap-5 lg:hidden">
      {sections.map((section) => (
        <ResponsiveCard key={section.id} section={section} about={about} />
      ))}
    </div>
  );
}

function ResponsiveCard({
  section,
  about,
}: {
  section: AboutSection;
  about: AboutPageData;
}) {
  return (
    <article
      className="relative w-full max-w-[340px]  overflow-hidden rounded-[16px] border border-[#d8bf8a]/65 bg-cover bg-center p-3 shadow-[0_8px_20px_rgba(80,55,28,0.10)] min-[445px]:max-w-[600px] md:min-h-[430px] md:max-w-[330px] md:rounded-[18px] md:p-4"
      style={{
        backgroundImage: `url('${about.cardBgImage || FALLBACKS.card}')`,
      }}
    >
      <CardTexture textureImage={about.textureImage} />

      {section.heading && (
        <p
          className={`relative z-10 mb-2 text-center md:mb-3 md:text-left ${styles.heading}`}
        >
          {section.heading}
        </p>
      )}

      <div className="relative z-10 grid grid-cols-[105px_1fr] items-center gap-3 min-[445px]:grid-cols-[130px_1fr] min-[445px]:gap-4 md:block">
        <div className="relative h-[112px] overflow-hidden rounded-[12px] min-[445px]:h-[135px] md:h-[190px] md:rounded-[13px]">
          <Image
            src={section.image}
            alt={section.title}
            fill
            className={section.contain ? "object-contain p-3" : "object-cover"}
          />
        </div>

        <div>
          <h2 className={`whitespace-pre-line md:mt-4 ${styles.title}`}>
            {section.title}
          </h2>

          <p className={`mt-2 leading-[1.4] md:leading-[1.45] ${styles.body}`}>
            {section.text}
          </p>
        </div>
      </div>
    </article>
  );
}

function ImageCard({
  image,
  alt,
  cardBgImage,
  textureImage,
  className = "",
  aspect,
  contain = false,
}: {
  image: string;
  alt: string;
  cardBgImage: string;
  textureImage: string;
  className?: string;
  aspect: string;
  contain?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[14px] border border-[#c9aa7e]/70 bg-cover bg-center shadow-[0_8px_28px_rgba(60,38,14,0.16)] ${className}`}
      style={{
        aspectRatio: aspect,
        backgroundImage: `url('${cardBgImage || FALLBACKS.card}')`,
      }}
    >
      <CardTexture textureImage={textureImage} />

      <Image
        src={image}
        alt={alt}
        fill
        className={`relative z-10 p-2.5 ${
          contain ? "object-contain" : "object-cover"
        }`}
      />

      <div className="absolute inset-[6px] z-20 rounded-[9px] border border-[#d6c49a]/50" />
    </div>
  );
}

function TextBlock({
  title,
  text,
  narrow = false,
}: {
  title: string;
  text: string;
  narrow?: boolean;
}) {
  return (
    <div className="flex-1">
      <h3 className={`${styles.title} ${narrow ? "max-w-[82%]" : ""}`}>
        {title}
      </h3>

      <p className={`${styles.body} mt-2 ${narrow ? "max-w-[82%]" : ""}`}>
        {text}
      </p>
    </div>
  );
}

function CardTexture({ textureImage }: { textureImage?: string }) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-multiply"
      style={{
        backgroundImage: `url('${textureImage || FALLBACKS.texture}')`,
      }}
    />
  );
}
