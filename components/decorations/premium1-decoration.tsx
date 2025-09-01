"use client";

import { Img } from "../ui/Img";

interface Premium1DecorationProps {
  withAOS?: boolean;
  type?: "001" | "002" | "003";
}

const Premium1Decoration: React.FC<Premium1DecorationProps> = ({
  withAOS = true,
  type = "001",
}) => {
  const aosAttr = (animation: string) =>
    withAOS ? { "data-aos": animation } : {};

  return (
    <>
      {type === "001" ? (
        <>
          <div
            className="absolute -top-2 -left-5 z-20"
            {...aosAttr("fade-right")}
          >
            <Img
              src="/assets/themes/premium-001/img/leaf-green-02.png"
              alt="Leaf Green"
              wrapperClassName="w-36 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -top-2 -right-5 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/leaf-green-02.png"
                alt="Leaf Green"
                wrapperClassName="w-36 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute -bottom-2 -left-6 z-20"
            {...aosAttr("fade-right")}
          >
            <Img
              src="/assets/themes/premium-001/img/leaf-green-01.png"
              alt="Leaf Green"
              wrapperClassName="w-28 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-2 -right-6 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/leaf-green-01.png"
                alt="Leaf Green"
                wrapperClassName="w-28 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute top-0 -left-14 z-0"
            {...aosAttr("fade-down")}
          >
            <Img
              src="/assets/themes/premium-001/img/abstract_splash.png"
              alt="Abstract Splash"
              wrapperClassName="w-96 aspect-square animate-leaf-float opacity-35"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 -right-14 z-0"
            {...aosAttr("fade-up")}
          >
            <div className="scale-y-[-1] scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/abstract_splash.png"
                alt="Abstract Splash"
                wrapperClassName="w-96 aspect-square animate-leaf-float opacity-35"
                sizes="300px"
                priority
              />
            </div>
          </div>
        </>
      ) : type === "002" ? (
        <>
          <div
            className="absolute  top-0 -left-14 z-0"
            {...aosAttr("fade-down")}
          >
            <Img
              src="/assets/themes/premium-001/img/abstract_splash.png"
              alt="Abstract Splash"
              wrapperClassName="w-96 aspect-square animate-leaf-float opacity-35"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 -right-14 z-0"
            {...aosAttr("fade-up")}
          >
            <div className="scale-y-[-1] scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/abstract_splash.png"
                alt="Abstract Splash"
                wrapperClassName="w-96 aspect-square animate-leaf-float opacity-35"
                sizes="300px"
                priority
              />
            </div>
          </div>
        </>
      ) : type === "003" ? (
        <>
          <div
            className="absolute -top-2 -left-5 z-20"
            {...aosAttr("fade-right")}
          >
            <Img
              src="/assets/themes/premium-001/img/leaf-green-02.png"
              alt="Leaf Green"
              wrapperClassName="w-36 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -top-2 -right-5 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/leaf-green-02.png"
                alt="Leaf Green"
                wrapperClassName="w-36 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute -bottom-2 -left-6 z-20"
            {...aosAttr("fade-right")}
          >
            <Img
              src="/assets/themes/premium-001/img/leaf-green-01.png"
              alt="Leaf Green"
              wrapperClassName="w-28 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-2 -right-6 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/leaf-green-01.png"
                alt="Leaf Green"
                wrapperClassName="w-28 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div className="absolute top-0 -left-5 z-0" {...aosAttr("fade-down")}>
            <Img
              src="/assets/themes/premium-001/img/abstract_splash.png"
              alt="Abstract Splash"
              wrapperClassName="w-96 aspect-square animate-leaf-float opacity-50"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 -right-5 z-0"
            {...aosAttr("fade-up")}
          >
            <div className="scale-y-[-1] scale-x-[-1]">
              <Img
                src="/assets/themes/premium-001/img/abstract_splash.png"
                alt="Abstract Splash"
                wrapperClassName="w-96 aspect-square animate-leaf-float opacity-50"
                sizes="300px"
                priority
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Premium1Decoration;
