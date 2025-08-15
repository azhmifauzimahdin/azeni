"use client";

import { Img } from "../ui/Img";

interface Premium1DecorationProps {
  withAOS?: boolean;
}

const Premium1Decoration: React.FC<Premium1DecorationProps> = ({
  withAOS = true,
}) => {
  const aosAttr = (animation: string) =>
    withAOS ? { "data-aos": animation } : {};

  return (
    <>
      <div className="absolute top-8 -left-40" {...aosAttr("fade-down-left")}>
        <div>
          <Img
            src="/assets/themes/premium-001/img/leaf_green_01.png"
            alt="Leaf Green"
            wrapperClassName="w-56 aspect-square animate-leaf-wiggle"
            sizes="300px"
            priority
          />
        </div>
      </div>

      <div
        className="absolute -top-10 -left-28"
        {...aosAttr("fade-down-right")}
      >
        <div className="rotate-[65deg]">
          <Img
            src="/assets/themes/premium-001/img/leaf_green_02.png"
            alt="Leaf Green"
            wrapperClassName="w-52 aspect-square animate-leaf-wiggle"
            sizes="300px"
            priority
          />
        </div>
      </div>

      <div className="absolute top-12 -left-40" {...aosAttr("zoom-in")}>
        <div className="rotate-[75deg]">
          <Img
            src="/assets/themes/premium-001/img/leaf_gold_01.png"
            alt="Leaf Gold"
            wrapperClassName="w-56 aspect-square animate-leaf-wiggle"
            sizes="300px"
            priority
          />
        </div>
      </div>

      <div className="absolute -top-16 -right-24" {...aosAttr("fade-left")}>
        <Img
          src="/assets/themes/premium-001/img/abstract_splash.png"
          alt="Abstract Splash"
          wrapperClassName="w-72 aspect-square"
          sizes="300px"
          priority
        />
      </div>

      {/* BOTTOM DECORATIONS */}
      <div
        className="absolute -bottom-28 -right-8"
        {...aosAttr("fade-up-right")}
      >
        <div className="-rotate-[30deg]">
          <Img
            src="/assets/themes/premium-001/img/leaf_green_01.png"
            alt="Leaf Green"
            wrapperClassName="w-56 aspect-square animate-leaf-wiggle"
            sizes="300px"
            priority
          />
        </div>
      </div>

      <div className="absolute -bottom-28 -right-36" {...aosAttr("zoom-in-up")}>
        <div className="rotate-12">
          <Img
            src="/assets/themes/premium-001/img/leaf_gold_01.png"
            alt="Leaf Gold"
            wrapperClassName="w-72 aspect-square animate-leaf-wiggle"
            sizes="300px"
            priority
          />
        </div>
      </div>

      <div
        className="absolute -bottom-20 -right-8"
        {...aosAttr("fade-up-left")}
      >
        <div className="rotate-[60deg]">
          <Img
            src="/assets/themes/premium-001/img/leaf_green_02.png"
            alt="Leaf Green"
            wrapperClassName="w-56 aspect-square animate-leaf-wiggle"
            sizes="300px"
            priority
          />
        </div>
      </div>

      <div className="absolute -bottom-16 -left-24" {...aosAttr("zoom-in-up")}>
        <div className="rotate-180">
          <Img
            src="/assets/themes/premium-001/img/abstract_splash.png"
            alt="Abstract Splash"
            wrapperClassName="w-72 aspect-square"
            sizes="300px"
            priority
          />
        </div>
      </div>
    </>
  );
};

export default Premium1Decoration;
